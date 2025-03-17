import os
import subprocess
import hashlib
import pandas as pd
from sqlalchemy import create_engine
import zipfile
import config
from urllib.parse import quote_plus


def download_dataset():
    print("Baixando dataset...")
    subprocess.run([
        "kaggle", "datasets", "download", 
        "-d", config.KAGGLE_DATASET, 
        "--force"
    ])

def unzip_dataset():
    if os.path.exists(config.DATASET_ZIP):
        print("Descompactando dataset...")
        with zipfile.ZipFile(config.DATASET_ZIP, 'r') as zip_ref:
            zip_ref.extractall(config.DATASET_FOLDER)
    else:
        print("Arquivo zip não encontrado!")

def calculate_hash(filepath):
    hasher = hashlib.md5()
    with open(filepath, "rb") as f:
        buf = f.read()
        hasher.update(buf)
    return hasher.hexdigest()

def update_database():
    # Lista de tuplas: (nome do arquivo, nome da tabela)
    # Incluímos o arquivo CSV "losses_ukraine.csv"
    arquivos = [
        ("russia_losses_equipment_correction.csv", "russia_losses_equipment_correction"),
        ("russia_losses_equipment.csv", "russia_losses_equipment"),
        ("russia_losses_personnel.csv", "russia_losses_personnel"),
        ("losses_ukraine.csv", "losses_ukraine")
    ]
    
    MYSQL_HOST = "localhost"
    encoded_password = quote_plus(config.MYSQL_PASSWORD)
    connection_str = f"mysql+pymysql://{config.MYSQL_USER}:{encoded_password}@{config.MYSQL_HOST}:{config.MYSQL_PORT}/{config.MYSQL_DB}"

    engine = create_engine(connection_str)
    
    for nome_arquivo, tabela in arquivos:
        file_path = os.path.join(config.DATASET_FOLDER, nome_arquivo)
        if not os.path.exists(file_path):
            print(f"Arquivo {nome_arquivo} não encontrado. Verifique o nome e o caminho.")
            continue
        
        # Calcula o hash do arquivo para evitar duplicações
        new_hash = calculate_hash(file_path)
        hash_filename = f"{nome_arquivo}_hash.txt"
        
        update_needed = True
        if os.path.exists(hash_filename):
            with open(hash_filename, "r") as f:
                old_hash = f.read().strip()
            if old_hash == new_hash:
                update_needed = False
        
        if update_needed:
            print(f"Atualização detectada para {tabela}. Atualizando...")
            try:
                # Como o arquivo é CSV, usamos read_csv
                df = pd.read_csv(file_path, sep=",", encoding="utf-8")
                df.to_sql(tabela, engine, if_exists="replace", index=False)
                with open(hash_filename, "w") as f:
                    f.write(new_hash)
                print(f"Tabela {tabela} atualizada com sucesso.")
            except Exception as e:
                print(f"Erro ao atualizar a tabela {tabela}: {e}")
        else:
            print(f"Nenhuma atualização detectada para {tabela}.")
    
    engine.dispose()
    print("Banco de dados atualizado com sucesso.")

def main():
    download_dataset()
    unzip_dataset()
    update_database()

if __name__ == "__main__":
    main()
