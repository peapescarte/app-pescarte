import os
import requests
import shutil

from zipfile import ZipFile

def list_files(dir_name):
    try:
        files = os.listdir(dir_name)
        return files
    except:
        print(f'[!] Erro ao tentar listar os arquivos de {dir_name}')

def download_file(file_url, file_name) -> str:
    response = requests.get(file_url)
    file_name = file_name.replace(' ', '')

    if response.status_code == 200:
        os.makedirs(os.path.dirname('tmp/'), exist_ok=True)
        print(f'[*] Baixando arquivo: {file_name}...')
        with open('tmp/' + file_name, 'wb') as f:
            f.write(response.content)

    return file_name

def move_file(source: str, target: str) -> bool:
    try:
        print(f'[*] Movendo arquivo {source} para {target}')
        shutil.move(source, target)
        return True
    except:
        print(f'[!] Não foi possível mover o arquivo {source} para {target}')
        return False


def remove_file(file_name):
    try:
        os.remove(f'{file_name}')
    except:
        return

def pdf_to_txt(pdf_file):
    file_name = pdf_file.split('.')[0]
    try:
        os.system(f'pdftotext -layout tmp/{pdf_file} tmp/{file_name}.txt')
        file_path = f"tmp/{file_name}.txt"
        return file_path
    except:
        print(f"[!] Erro ao converter pdf em txt: {pdf_file}")

def clear_tmp():
    try:
        shutil.rmtree("tmp")
    except:
        print("[!] Erro ao limpar o diretorio 'tmp'")

def unzip_all_files(file_name):
    print(f'[*] Unziping file {file_name}')
    with ZipFile(file_name, 'r') as f:
        pdfs = f.namelist()

        f.extractall("tmp/")