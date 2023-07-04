import pandas as pd
import re
import db_utils

from datetime import datetime

MONTHS = {
    'janeiro': '01',
    'fevereiro': '02',
    'março': '03',
    'abril': '04',
    'maio': '05',
    'junho': '06',
    'julho': '07',
    'agosto': '08',
    'setembro': '09',
    'outubro': '10',
    'novembro': '11',
    'dezembro': '12'
}

def read_reference_table():
    data = db_utils.read_from_table('public', 'pescados', 'cod_pescado, descricao')
    df = pd.DataFrame(data, columns=['cod_pescado', 'descricao'])
    return df

def rename_products(df):
    df.loc[(df.produto == 'CAMARÃO BARBAS'), 'produto'] = 'CAMARÃO 7 BARBAS'
    df.loc[(df.produto == 'CAMARÃO RUSSA'), 'produto'] = 'CAMARÃO BARBA RUSSA'
    df.loc[(df.produto == 'CAVALA'), 'produto'] = 'CAVACA'
    df.loc[(df.produto == 'PESCADA MARIA MOLE'), 'produto'] = 'MARIA MOLE'
    df.loc[(df.produto == 'SARDINHA VG'), 'produto'] = 'SARDINHA VERDADEIRA'
    return df

def join_dfs(df1, df2):
    df = pd.merge(df1, df2, left_on='produto', right_on = 'descricao', how='left')
    return df

def check_valid_date(file_date: str) -> datetime.strftime:
    try:
        new_date = datetime.strptime(file_date, '%d-%m-%Y')
        new_date = datetime.strftime(new_date, '%Y-%m-%d')
        return new_date
    except:
        print(f"[!] Não foi possível converter {file_date} para data")
        return None

def get_file_date(file_name):
    # get year from file_name
    year = re.search('[0-9]{4}', file_name)
    year = year.group(0)
    try:
        with open(file_name, 'r') as f:
            lines = f.readlines()
            for line in lines:
                if 'Boletim' in line:
                    new_line = re.sub('\s\s+','|',line)
                    new_line = new_line.split('|')
                    new_line[-1] = new_line[-1].replace('\n','')
                    new_line = new_line[1:-1]
                    new_line[1] = MONTHS[new_line[1].lower()]
                    try:
                        _aux_year = int(new_line[-1])
                    except:
                        new_line[-1] = year
                    new_line[0] = new_line[0].zfill(2)
                    date = '-'.join(new_line)
                    break
        date = check_valid_date(date)
        return date
    except:
        return None

def create_dataframe(lines: list) -> pd.DataFrame:
    header = ['produto', 'minima', 'mais comum', 'maxima', 'media', 'min/max', 'nd/da']
    df = pd.DataFrame(lines, columns=header)
    del df["min/max"]
    del df["nd/da"]

    return df

def words_in_string(word_list: list, a_string: str) -> bool:
    result = set(word_list).intersection(a_string.split())
    if result:
        return True

    return False 

def line_str_to_list(list_of_lines: list) -> list:
    new_lines = []
    keywords = ['Pescados', 'Máxima', 'Comum', 'Mínima', 'Média']
    for i in range(len(list_of_lines)):
        for line in list_of_lines[i]:
            if not words_in_string(keywords, line) and line:
                new_line = re.sub('\s\s+','|',line)
                new_line = new_line.split('|')
                new_line[-1] = new_line[-1].replace('\n','')

                while len(new_line) < 7:
                    new_line.append('0.0')

                # check if the line has valid product name
                new_line[0] = re.sub(r'[^a-zA-ZÀ-ÿ ]', '',new_line[0])
                new_line[0] = new_line[0].strip()
                if new_line[0] != '':
                    new_lines.append(new_line)

    return new_lines

def remove_bad_data(all_data: list, bad_idx: list) -> list:
    cleaned_list = []
    for i, data in enumerate(all_data):
        if i not in bad_idx:
            cleaned_list.append(data)

    return cleaned_list

def scrape(file_name):
    print(f'[*] Obtendo dados do arquivo {file_name}')
    df_reference = read_reference_table()
    try:
        all_pescado = []
        with open(file_name, 'r') as f:
            lines = f.readlines()
            is_pescado = False
            for i, line in enumerate(lines):
                    
                if "Pescado" in line:
                    pescado = []
                    if not is_pescado:
                        is_pescado = True
                        pescado.append(line)
            
                elif "Sistema de Informação do Mercado Agrícola" in line and is_pescado:
                    is_pescado = False
                    all_pescado.append(pescado)

                if is_pescado:
                    pescado.append(line)
            
        new_lines = line_str_to_list(all_pescado)

        df = create_dataframe(new_lines)
        df['produto'] = df['produto'].str.replace('  ', ' ')
        df = rename_products(df)
        df = df.drop_duplicates(subset=['produto'], keep='first')
        df_final = join_dfs(df, df_reference)
        df_final = pd.DataFrame(df_final, columns=['cod_pescado', 'minima', 'mais comum', 'maxima', 'media'])
        all_data = df_final.values.tolist()

        bad_data_idx = []

        for i, line in enumerate(all_data):
            try:
                line[1] = float(line[1].replace(',', '.'))
                line[2] = float(line[2].replace(',', '.'))
                line[3] = float(line[3].replace(',', '.'))
                line[4] = float(line[4].replace(',', '.'))
            except:
                print(f"[!] Dado inválido na linha {i+1} do arquivo {file_name}")
                print(line)
                bad_data_idx.append(i)

        all_data = remove_bad_data(all_data, bad_data_idx)
        return all_data
    
    except:
        print(f'[!] Erro ao obter dados do arquivo {file_name}')
        return None
