from flask import Flask, render_template, jsonify, request
from bs4 import BeautifulSoup
from apscheduler.schedulers.background import BackgroundScheduler 
from urllib.parse import urljoin
import requests
import os
import random
from PIL import Image
import joblib
import re
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from transformers import pipeline
from space import space_bp
import threading
from googletrans import Translator
from extensions import db
from config import SQLALCHEMY_DATABASE_URI
from flask_migrate import Migrate
from dotenv import load_dotenv

#>>>----------------------------------------DB e Blueprint Space--------------------------------------------<<<
# Registra o blueprint 'space'
app = Flask(__name__)
app.register_blueprint(space_bp)

migrate = Migrate(app, db)

app.config['SQLALCHEMY_DATABASE_URI'] = SQLALCHEMY_DATABASE_URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

#>>>-----------------------------------------Modelo de seleção---------------------------------------------<<<
nltk.download('punkt_tab')
nltk.download('stopwords')
nltk.download('averaged_perceptron_tagger')

stop_words = set(stopwords.words("english"))

def preprocess_text(text):
    text = text.lower()
    text = re.sub(r'[^\w\s]', ' ', text)
    text = re.sub(r'\s+', ' ', text)
    tokens = word_tokenize(text)
    tokens = [word for word in tokens if word not in stop_words]
    return " ".join(tokens)

modelo = joblib.load("modelo_relevancia_2.pkl")
vectorizar = joblib.load("vectorizer_2.pkl")

def prever_relevancia(titilo):
    titulo_processado = preprocess_text(titilo)
    titulo_vetorizado = vectorizar.transform([titulo_processado]).toarray()
    previsao = modelo.predict(titulo_vetorizado)
    return previsao[0]


#>>>---------------------------------------Função de resumo---------------------------------------------<<<
# Configuração do pipeline com limite máximo definido
summarizer = pipeline("summarization", model="sshleifer/distilbart-cnn-12-6")
summarizer.tokenizer.model_max_length = 1024  # define o valor máximo de tokens

# Lock para evitar acesso concorrente
summarizer_lock = threading.Lock()

def extrair_texto(url):
    try:
        resposta = requests.get(url, timeout=10)
        resposta.raise_for_status()
        soup = BeautifulSoup(resposta.text, 'html.parser')
        paragrafos = soup.find_all('p')
        texto = " ".join([p.get_text() for p in paragrafos])
        return texto.strip()
    except Exception as e:
        print(f"Erro ao acessar {url}: {e}")
        return None

def gerar_resumo(texto, max_length=150, min_length=5):
    if not texto:
        return "Não foi possível gerar um resumo."
    
    # Tokeniza sem truncamento para medir o comprimento real
    tokens = summarizer.tokenizer(texto, return_tensors="pt", truncation=False, max_length=1024)
    input_length = tokens.input_ids.shape[1]
    
    # Se o texto for curto, retorna o próprio texto
    if input_length < max_length or input_length < min_length:
        return texto
    
    try:
        # Garante acesso exclusivo ao pipeline durante a geração
        with summarizer_lock:
            resultado = summarizer(
                texto,
                max_length=max_length,
                min_length=min_length,
                truncation=True,
                do_sample=False
            )
        return resultado[0]['summary_text']
    except Exception as e:
        print(f"Erro ao gerar resumo: {e}")
        return texto

#>>>--------------------------------------Função de tradução---------------------------------------------------<<<

translator = Translator()

def traduzir_texto(texto, destino='pt'):
    traducao = translator.translate(texto, dest=destino)
    return traducao.text


#>>>--------------------------------------Função API DB---------------------------------------------------<<<

from sqlalchemy import create_engine, text
from urllib.parse import quote_plus

load_dotenv(dotenv_path='access.env')


# Configure as credenciais do banco
DB_USER = os.getenv("DB_USER_ukwar")
DB_PASSWORD = os.getenv("DB_PASSWORD_ukwar")
DB_NAME = os.getenv("DB_NAME_ukwar")
DB_HOST = "127.0.0.1"
DB_PORT = "3306"

# Codifica a senha para evitar problemas com caracteres especiais
encoded_password = quote_plus(DB_PASSWORD)
connection_str = f"mysql+pymysql://{DB_USER}:{encoded_password}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
engine = create_engine(connection_str)

@app.route('/api/data')
def get_data():
    query_correction = text("SELECT * FROM tabela_russia_losses_equipment")
    query_equipment = text("SELECT * FROM tabela_russia_losses_equipment_correction")
    query_personnel = text("SELECT * FROM tabela_russia_losses_personnel")
    query_losses_ukraine = text("SELECT * FROM tabela_losses_ukraine")
    
    with engine.connect() as connection:
        result_correction = connection.execute(query_correction)
        data_correction = [dict(row) for row in result_correction.mappings()]
        
        result_equipment = connection.execute(query_equipment)
        data_equipment = [dict(row) for row in result_equipment.mappings()]
        
        result_personnel = connection.execute(query_personnel)
        data_personnel = [dict(row) for row in result_personnel.mappings()]

        result_losses = connection.execute(query_losses_ukraine)
        data_losses_ukraine = [dict(row) for row in result_losses.mappings()]
    
    # Retorna um objeto com as três tabelas
    return jsonify({
        "personnel": data_personnel,
        "equipment": data_equipment,
        "equipment_correction": data_correction,
        "losses_ukraine": data_losses_ukraine
    })



#>>>----------------------------------------------------------------------------------------------------<<<

# Função de scraping para The Guardian
def obter_noticias_Guardian():
    url = "https://www.theguardian.com/international"
    response = requests.get(url)
    soup = BeautifulSoup(response.text, "html.parser")
    noticias = []

    for item in soup.find_all('ul', class_="dcr-pnnc7v"):
        titulo_tag = item.find('span')
        if titulo_tag:
            titulo = titulo_tag.get_text(strip=True)
            link_tag = item.find('a', href=True)
            link = urljoin(url, link_tag['href']) if link_tag else None

        imagem_tag = item.find('img', src=True)
        imagem = urljoin(url, imagem_tag.get('srcset') or imagem_tag.get('src')) if imagem_tag else None

       
        if titulo and link and prever_relevancia(titulo) == 1:
            # Extrai o conteúdo da notícia e gera o resumo
                texto_noticia = extrair_texto(link)
                resumo = gerar_resumo(texto_noticia)
                titulo_traduzido = traduzir_texto(titulo)
                noticias.append({
                "titulo": titulo,
                "link": link,
                "imagem": imagem,
                "resumo": "",
                "source": "The Guardian"
            })

    return noticias

def obter_noticias_bbc():
    url = "https://www.bbc.com/news/live/c981p3dxnent"
    response = requests.get(url)
    soup = BeautifulSoup(response.text, "html.parser")
    noticias = []

    for item in soup.find_all('div', class_="ssrcss-kete4f-StreamWrapperStyle e1p0c9tz3"):
        titulo_tag = item.find('span')
        if titulo_tag:
            titulo = titulo_tag.get_text(strip=True)
            link_tag = item.find('a', href=True)
            link = urljoin(url, link_tag['href']) if link_tag else None

        imagem_tag = item.find('img', src=True)

        imagem = urljoin(url, imagem_tag['src']) if imagem_tag else None

        if titulo and link and prever_relevancia(titulo) == 1:
            # Extrai o conteúdo da notícia e gera o resumo
                texto_noticia = extrair_texto(link)
                resumo = gerar_resumo(texto_noticia)
                titulo_traduzido = traduzir_texto(titulo)
                noticias.append({
                "titulo": titulo,
                "link": link,
                "imagem": imagem,
                "resumo": "",
                "source": "Deutsche Welle (DW)"
            })


    return noticias


# Função de scraping para DW
def obter_noticias_dw():
    url = "https://www.dw.com/en/top-stories/s-9097"
    response = requests.get(url)
    soup = BeautifulSoup(response.text, "html.parser")
    noticias = []

    for item in soup.find_all('div', class_="teaser-wrap col-12 col-md-6 col-lg-4"):
        titulo_tag = item.find('a', class_="lap31d1 l1amv4u6 btl76l3 e1eo633p wgx1hx2 b1ho1h07")
        if titulo_tag:
            titulo = titulo_tag.get_text(strip=True)
            link_tag = item.find('a', href=True)
            link = urljoin(url, link_tag['href']) if link_tag else None

        imagem_tag = item.find('img', src=True)

        imagem = urljoin(url, imagem_tag.get('srcset') or imagem_tag.get('src')) if imagem_tag else None

        if titulo and link and prever_relevancia(titulo) == 1:
            # Extrai o conteúdo da notícia e gera o resumo
                texto_noticia = extrair_texto(link)
                resumo = gerar_resumo(texto_noticia)
                noticias.append({
                "titulo": titulo,
                "link": link,
                "imagem": imagem,
                "resumo": "",
                "source": "Deutsche Welle (DW)"
            })


    return noticias


# Função de scraping para Al Jazeera
def obter_noticias_aljazeera():
    url = "https://www.aljazeera.com/news"
    response = requests.get(url)
    soup = BeautifulSoup(response.text, "html.parser")
    noticias = []

    for item in soup.find_all('article'):
        titulo_tag = item.find('h3')
        if titulo_tag:
            titulo = titulo_tag.get_text(strip=True)
            link_tag = titulo_tag.find('a', href=True)
            link = f"https://www.aljazeera.com{link_tag['href']}" if link_tag else None
            imagem_tag = item.find('img', src=True)

            imagem = urljoin(url, imagem_tag['src']) if imagem_tag else None

            if titulo and link and prever_relevancia(titulo) == 1:
                # Extrai o conteúdo da notícia e gera o resumo
                texto_noticia = extrair_texto(link)
                resumo = gerar_resumo(texto_noticia)
                titulo_traduzido = traduzir_texto(titulo)
                noticias.append({
                "titulo": titulo,
                "link": link,
                "imagem": imagem,
                "resumo": "",
                "source": "Al Jazeera"
            })

    return noticias

# Função principal para obter todas as notícias
def obter_todas_as_noticias():
    noticias = []
    try:
        noticias.extend(obter_noticias_Guardian())
    except Exception as e:
        print(f"Erro ao obter notícias da Guardian: {e}") 

    try:
        noticias.extend(obter_noticias_dw())
    except Exception as e:
        print(f"Erro ao obter notícias da dw: {e}")

    try:
        noticias.extend(obter_noticias_aljazeera())
    except Exception as e:
        print(f"Erro ao obter notícias da Al Jazeera: {e}")

    try:
        noticias.extend(obter_noticias_bbc())
    except Exception as e:
        print(f"Erro ao obter notícias da BBC: {e}")


    return noticias

#>>>----------------------------------------------------------------------------------------------------<<<

# Função para obter a imagem correspondente ao título
def get_image_for_headline(titulo):
    keywords_to_directories = {
        "Trump": "static/images/trump/",
        "Biden": "static/images/biden/",
        "ONU": "static/images/onu/",
        "guerra": "static/images/war/",
        "China": "static/images/china/",
        "Rússia": "static/images/russia/",
        "falcon": "static/images/falcon/",
        frozenset(["putin", "trump"]): "static/images/putin_trump/",
    }

    for keyword, directory in keywords_to_directories.items():
        # Se a palavra-chave aparecer no título...
        if isinstance(keyword, str) and keyword.lower() in titulo.lower():
            # Verifica se a pasta existe
            if os.path.exists(directory):
                images = [
                    os.path.join(directory, file)
                    for file in os.listdir(directory)
                    if file.lower().endswith((".jpg", ".png", ".jpeg"))
                ]
                if images:
                    return random.choice(images)
            # Se não existe ou está vazia, pode continuar procurando ou usar uma imagem padrão
    # Se não encontrou nada, volta a imagem padrão
    return "static/images/default.png"


# Rota para a página inicial (index.html)
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/noticias')
def home():
    noticias = obter_todas_as_noticias()
    # Seleciona a primeira notícia como destaque
    destaque = noticias[0] if noticias else {"titulo": "Sem notícias disponíveis", "imagem": "", "link": "#"}
    # Remove a notícia de destaque da lista de notícias
    noticias = noticias[1:] if len(noticias) > 1 else []
    # Determina a imagem para o destaque com base no título
    destaque['imagem'] = get_image_for_headline(destaque['titulo'])
    # Debug: Verifique a imagem escolhida
    print(f"Imagem para o título '{destaque['titulo']}': {destaque['imagem']}")

    noticias = noticias[1:] if len(noticias) > 1 else []
    return render_template('noticias.html', destaque=destaque, noticias=noticias)


@app.route('/resumo')
def resumo():
    url = request.args.get('url')
    if not url:
        return jsonify({"error": "URL não fornecido"}), 400
    
    texto_noticia = extrair_texto(url)
    resumo_texto = gerar_resumo(texto_noticia)
    resumo_traduzido = traduzir_texto(resumo_texto)
    return jsonify({"resumo": resumo_texto})

@app.route('/dashboard_russ_ukraine')
def timeline_ukraine():
    return render_template('dashboard_russ_ukraine.html')

@app.route('/sobre', endpoint='sobre_page')
def sobre_page():
    return render_template('sobre.html')


if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Cria as tabelas se não existirem
    app.run(debug=True, use_reloader=False)