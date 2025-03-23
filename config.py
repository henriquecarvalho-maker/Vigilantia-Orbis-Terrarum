import os
from dotenv import load_dotenv
from urllib.parse import quote_plus

#---------------------------------------Carregando credenciais space_db-----------------------------------------

load_dotenv(dotenv_path='access.env')

# Obtndo as credenciais do ambiente
usuario = os.getenv("DB_USER")
senha = os.getenv("DB_PASSWORD")
nome_do_banco = os.getenv("DB_NAME")

# Codifica quote_plus
senha_codificada = quote_plus(senha)

# Constrói a URI de conexão
SQLALCHEMY_DATABASE_URI = f"mysql+pymysql://{usuario}:{senha_codificada}@localhost/{nome_do_banco}"



#---------------------------------------Carregando credenciais ukraine_war_db-----------------------------------------

nome_do_banco_war = os.getenv("DB_NAME_ukwar")
usuario_ukwar = os.getenv("DB_USER_ukwar")
senha_ukwar = os.getenv("DB_PASSWORD_ukwar")
senha_codificada_war = quote_plus(senha_ukwar)

# Dados do dataset Kaggle
DATASET_ZIP = "2022-ukraine-russian-war.zip"
DATASET_FOLDER = "2022-ukraine-russian-war"
CSV_FILENAME = "dados.csv"  # Atualize para o nome correto do CSV extraído
HASH_FILENAME = "data_hash.txt"
KAGGLE_DATASET = "piterfm/2022-ukraine-russian-war"

# Configurações MySQL
MYSQL_USER = usuario_ukwar
MYSQL_PASSWORD = senha_codificada_war
MYSQL_HOST = "localhost"
MYSQL_PORT = "3306"
MYSQL_DB = nome_do_banco_war
