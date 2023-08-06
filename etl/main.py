import crawlers.pesagro as pesagro

from datetime import datetime

if __name__ == "__main__":
    today = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    print(f'[*] Iniciando atualização da base de pescados: {today}')

    # Chama todos os crawlers

    # Pesagro
    pesagro.pesagro_crawler()