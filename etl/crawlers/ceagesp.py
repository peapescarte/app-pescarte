import json
import re
import requests
import db_utils
import os
from datetime import datetime

import pandas as pd

from bs4 import BeautifulSoup

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import Select
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def parse_ceagesp_html(html):
    data = []
    header = []
    bs = BeautifulSoup(html, 'html.parser')

    table = bs.find('table', {'class': 'contacao_lista'})
    for i, tr in enumerate(table.find_all('tr')):
        row = []
        if i == 0: # categoria e data
            pass
        elif i == 1: # header
            for td in tr.find_all('td'):
                header.append(td.text)
        else:
            for td in tr.find_all('td'):
                row.append(td.text)
            data.append(row)

    df = pd.DataFrame(data=data, columns=header)
    return df

def get_available_dates(html):
    bs = BeautifulSoup(html, 'html.parser')

    for script_tag in bs.find_all('script'):
        text = script_tag.text
        if "PESCADOS" in text:
            pattern = '\"PESCADOS\":\[.*?]'
            result = re.search(pattern, text)
            if result:
                dates_to_get = '{' + result.group() + '}'
    
                dates_to_get = json.loads(dates_to_get)
                return dates_to_get

    return None

def run():

    url = 'https://ceagesp.gov.br/cotacoes/#cotacao'

    headers = {
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-US,en;q=0.9',
        'cache-control': 'max-age=0',
        'content-length': '42',
        'content-type': 'application/x-www-form-urlencoded',
        'origin': 'https://ceagesp.gov.br',
        'referer': 'https://ceagesp.gov.br/cotacoes/',
        'sec-ch-ua': '"Chromium";v="109", "Not_A Brand";v="99"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Linux"',
        'sec-fetch-dest': 'document',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'same-origin',
        'sec-fetch-user': '?1',
        'upgrade-insecure-requests': '1',
        'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
    }

    r = requests.Session()
    response = r.get(url)

    dates = get_available_dates(response.text)

    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--no-sandbox")

    driver = webdriver.Chrome(options=chrome_options)

    url = "https://ceagesp.gov.br/cotacoes"
    
    for date in dates['PESCADOS']:

        os.makedirs("./csv-ceagesp/", exist_ok=True)

        driver.get(url)

        dropdown = Select(driver.find_element(By.NAME, "cot_grupo"))
        dropdown.select_by_value("PESCADOS")

        campo_data = driver.find_element(By.NAME, "cot_data")
        print(date)
        driver.execute_script("arguments[0].value = \'" + date + "\';", campo_data)

        botao_consultar = driver.find_element(By.CSS_SELECTOR, ".form-group button.btn.btn-success")
        botao_consultar.click()

        WebDriverWait(driver, 60).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "table.contacao_lista tbody tr"))
        )

        linhas_tabela = driver.find_elements(By.CSS_SELECTOR, "table.contacao_lista tbody tr")

        dados_tabela = []

        for linha in linhas_tabela:
            colunas = linha.find_elements(By.TAG_NAME, "td")
            dados_linha = [coluna.text for coluna in colunas]
            dados_tabela.append(dados_linha)

        df = pd.DataFrame(dados_tabela)
        
        date = date.replace("/", '-')

        name = "tabela_ceagesp" + date + ".csv"

        name = "./csv-ceagesp/" + name

        df['data'] = date

        df.to_csv(name, index=False)

        with open(name, 'r', encoding='utf-8') as arquivo:
            linhas = arquivo.readlines()

        # Remove as primeiras linhas
        novas_linhas = linhas[2:]

        # Escreve de volta no arquivo
        with open(name, 'w', encoding='utf-8') as arquivo:
            arquivo.writelines(novas_linhas)

        inserted = db_utils.load_data('public', 
                            'cotacoes', 
                            ['data', 'link', 'fonte'],
                            [[db_utils.format_date(date), url + " " + name, 'ceagesp']])
        
        if not inserted:
            print('Data já adicionada')
            continue
        

        dados = pd.read_csv(name)
        nomes_existentes_query = db_utils.read_from_table('public', 'pescados', 'descricao')
        nomes_existentes = [item[0] for item in nomes_existentes_query]

        codigos_existentes_query = db_utils.read_from_table('public', 'pescados', 'cod_pescado')
        codigos_existentes = [item[0] for item in codigos_existentes_query]

        db_utils.adicionar_pescados(dados['Produto'].tolist(), nomes_existentes, codigos_existentes)

        for indice, item in dados.iterrows():

            print("INSERINDO: ", [db_utils.ler_codigo(item['Produto']), date, 'ceagesp', item['Menor'], item['Comun'], item['Maior'], 0, item['Classificação']])

            db_utils.load_data('public', 'cotacoes_pescados', 
                                ['cod_pescado', 'data', 'fonte', 'minimo', 'mais_comum', 'maximo', 'media', 'tamanho'], 
                                [[db_utils.ler_codigo(item['Produto']), db_utils.format_date(date), 'ceagesp', db_utils.format_number(item['Menor']), 
                                  db_utils.format_number(item['Comun']), db_utils.format_number(item['Maior']), 0, item['Classificação']]])
                
    diretorio = './csv-ceagesp'

    try:
        # Verifica se o diretório existe
        if os.path.exists(diretorio):
            # Itera sobre todos os arquivos e subdiretórios no diretório
            for arquivo in os.listdir(diretorio):
                caminho_completo = os.path.join(diretorio, arquivo)
                os.remove(caminho_completo)
    except Exception as e:
        print(f'Ocorreu um erro ao apagar: {str(e)}')
