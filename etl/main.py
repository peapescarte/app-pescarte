import crawler

from datetime import datetime

if __name__ == "__main__":
    today = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    print(f'[*] Iniciando atualização da base de pescados: {today}')

    # Chama todos os crawlers

    # Pesagro
    crawler.pesagro_crawler()