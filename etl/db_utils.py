import os
import psycopg2
from datetime import datetime

def get_conn():
    db_name = os.environ['POSTGRES_DB']
    db_port = os.environ['DATABASE_PORT']
    user = os.environ['POSTGRES_USER']
    password = os.environ['POSTGRES_PASSWORD']
    host = os.environ['DATABASE_HOST']

    conn = psycopg2.connect(
                            dbname=db_name,
                            user=user,
                            password=password,
                            host=host,
                            port=db_port)

    return conn


def load_data(schema, table, columns, data) -> bool:
    try:
        conn = get_conn()

        cols = ', '.join(col for col in columns)
        query_template = """
            INSERT INTO {}.{} ({}) VALUES ({})
        """

        with conn.cursor() as cur:
            for row in data:
                try:
                    row_data = ', '.join(f"'{value}'" for value in row)
                    cur.execute(query_template.format(schema, table, cols, row_data))
                except Exception as error:
                    print(f"[!] Erro ao inserir tupla: {row}")
                    print('\t', error)
                    conn.close()
                    return None

            conn.commit()


        conn.close()
        print(f'[*] Tabela {table} atualizada')
        return True

    except:
        return False


def read_from_table(schema, table, fields, where_clause=''):
    try:
        conn = get_conn()
        template = 'SELECT {} FROM {}.{} {}'

        with conn.cursor() as cur:
            cur.execute(template.format(fields, schema, table, where_clause))
            data = cur.fetchall()

            return data
            
    except:
        return None
    
def adicionar_pescados(nomes_novos, nomes_existentes, codigos_existentes):
    codigos = []

    print('nomes exist')
    print(nomes_existentes)

    for nome_pescado in nomes_novos:
        nome_pescado = nome_pescado.replace('-', ' ')

        # Verifica se o nome já existe na lista de nomes de pescado
        if nome_pescado in nomes_existentes:
            continue

        # Verifica se o nome é composto por apenas uma palavra
        if len(nome_pescado.split()) == 1:
            codigo = nome_pescado[:3]
            while codigo in codigos_existentes:
                codigo = codigo[:-1] + chr(ord(codigo[-1]) + 1)
            codigos_existentes.append(codigo)
            codigos.append(codigo)
        else:
            codigo = nome_pescado[0] + nome_pescado.split()[1][:2]
            while codigo in codigos_existentes:
                codigo = codigo[:-1] + chr(ord(codigo[-1]) + 1)
            codigos_existentes.append(codigo)
            codigos.append(codigo)

        print(f"Código escolhido para {nome_pescado}: {codigo}")

        load_data('public', 'pescados', ['cod_pescado', 'descricao', 'embalagem'], [[codigo, nome_pescado, 'KG']])

    return codigos
    
def ler_codigo(nome):

    nome = nome.replace('-', ' ')

    print('NOMEEEEE: '+ nome)

    print('LEITURA DA TABELA:')
    print(read_from_table('public', 'pescados', 'cod_pescado', 'WHERE descricao = \'' + nome + '\''))

    cod_list = [item[0] for item in read_from_table('public', 'pescados', 'cod_pescado', 'WHERE descricao = \'' + nome + '\'')]

    print("Cod list:")
    print(cod_list)

    return cod_list[0]

def format_number(number):
    return number.replace(',', '.')

def format_date(date):
    date_obj = datetime.strptime(date, '%d-%m-%Y')
    return date_obj.strftime('%Y-%m-%d')