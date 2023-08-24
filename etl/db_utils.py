import os
import psycopg2

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