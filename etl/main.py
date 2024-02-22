import crawlers.pesagro as pesagro
import crawlers.ceagesp as ceagesp
import time
from datetime import datetime

def crawler():
    today = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    print(f'[*] Iniciando atualização da base de pescados: {today}')

    # Chama todos os crawlers
    ceagesp.run()
    pesagro.pesagro_crawler()

if __name__ == "__main__":

    tempo = 24 * 60 * 60

    while True:
        crawler()
        print('[*] Crawler concluído, aguardando 24 horas... ')
        time.sleep(tempo)