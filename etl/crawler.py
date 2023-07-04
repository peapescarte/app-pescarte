import db_utils
import file_utils
import io
import os
import requests
import scrapers.pesagro as pesagro

from bs4 import BeautifulSoup
from datetime import datetime
from zipfile import ZipFile

'''
    Pesagro
'''
def get_pesagro_links() -> list:
    print('[*] Obtendo os links dos arquivos...')

    response = requests.get('https://www.pesagro.rj.gov.br/node/194')
    main_url = 'https://www.pesagro.rj.gov.br'

    bs = BeautifulSoup(response.text, 'html.parser')

    a_tags = bs.find_all('a')

    links = []
    for a_tag in a_tags:

        if a_tag.get('type', None) in ['application/pdf', 'application/zip']:
            links.append([main_url + a_tag.get('href'), a_tag.get('title')])

    return links

def pesagro_crawler():
    print('[*] Iniciando crawler Pesagro')
    db_schema = 'public'
    db_table = 'cotacoes'
    select_cols = 'link'
    where_statement = "where link = '{}'"

    links = get_pesagro_links()

    for link in links:
        file_url = link[0]
        file_name = link[1]
        file_name = file_name.replace(' ', '')

        if '.zip' in file_name:
            response = requests.get(file_url)
            if response.status_code == 200:
                zip = ZipFile(io.BytesIO(response.content))
                files_in_zip = zip.namelist()
                print(f'[*] Lendo conteúdo do arquivo: {file_name}')
                for pdf_file in files_in_zip:
                    pdf_name_in_zip = pdf_file
                    pdf_file = pdf_file.replace(' ', '')
                    # check in database if the file is present
                    query_result = db_utils.read_from_table(db_schema, db_table, select_cols, where_statement.format(pdf_file))
                    if query_result == []:
                        os.makedirs(os.path.dirname('tmp/'), exist_ok=True)
                        with open('tmp/' + pdf_file, 'wb') as pdf:
                            print(f'[*] Baixando arquivo: {pdf_file}')
                            to_extract = zip.open(pdf_name_in_zip)
                            content = to_extract.read()
                            pdf.write(content)
                        
                        file_path = file_utils.pdf_to_txt(pdf_file)
                        is_success = load_pesagro_data(file_path, pdf_file)

                        if is_success == None or is_success == False:
                            # move file to unsuccessfull load
                            if not os.path.exists('files_with_errors'):
                                os.makedirs('files_with_errors',  exist_ok=True)
                            source = 'tmp/' + pdf_file
                            file_utils.move_file(source, 'files_with_errors/' + pdf_file)
                            print(f'\t[-] Zip origem: {file_name}')


        elif '.pdf' in file_name:
            print(f'Baixando arquivo: {file_name}')
            query_result = db_utils.read_from_table(db_schema, db_table, select_cols, where_statement.format(file_name)) 
            if query_result == []:
                file_name = file_utils.download_file(file_url, file_name)
                file_path = file_utils.pdf_to_txt(file_name)
                is_success = load_pesagro_data(file_path, file_name)

                if is_success == None or is_success == False:
                    # move file to unsuccessfull load
                    if not os.path.exists('files_with_errors'):
                        os.makedirs('files_with_errors',  exist_ok=True)
                    file_utils.move_file('tmp/' + file_name, 'files_with_errors/' + file_name)
        
        file_utils.clear_tmp()

def load_pesagro_data(file_path, file_name):
    columns = ['cod_pescado', 'minimo', 'mais_comum', 'maximo', 'media', 'data', 'fonte']
    file_date = pesagro.get_file_date(file_path)

    if not file_date:
        print(f"[!] Erro ao obter a data do arquivo {file_name}. Verificar sua integridade")
        return None

    data = pesagro.scrape(file_path)
    if data:
        for line in data:
            line.append(file_date)
            line.append('pesagro')

        '''
            Carrega dados para a tabela cotacoes com informacoes:
            - data
            - nome do arquivo fonte das informacoes
            - fonte de dados
        '''
        was_loaded = db_utils.load_data('public', 
                            'cotacoes', 
                            ['data', 'link', 'fonte'],
                            [[file_date, file_name, 'pesagro']])
        if was_loaded:
            _ = db_utils.load_data('public', 'cotacoes_pescados', columns, data)
            return True

    return False