# ETL (Extract Transform Load)

## Conteúdo:
1. [Apresentação](#apresentação)
2. [Main](#main)
3. [Crawlers](#crawlers)
4. [Scrappers](#scrappers)
5. [Módulos Adicionais](#módulos-adicionais)
5.1. [file_utils.py](#file_utilspy)
5.2. [db_utils.py](#db_utilspy)
6. [Arquitetura Geral do ETL](#arquitetura-geral-de-etl)
7. [Execução](#execução)
8. [Como Adicionar Novos Crawlers e Scrappers](#como-adicionar-novos-crawlers-e-scrappers)
9. [Scheduler](#scheduler)


## Apresentação
Este módulo tem como finalidade extrair os dados de pescados de diferentes fontes disponíveis para consulta.
Além de automatizar a extração dos dados, é realizado o processamento e transformações necessárias para o armazenamento dessas informações no banco de dados.
O ETL foi desenhado para ser executado todos os dias para verificar em cada fonte se há informações novas para serem coletadas.

## Main
O arquivo *main.py* coordena a chamada de todos os processos que devem ser executados.
**O projeto está organizado por fonte de dados**, portanto, quando uma nova fonte é incluída, a mesma deve ser chamada neste arquivo para que ela possa ser executada!

Atualmente há apenas uma fonte, [pesagro](https://www.pesagro.rj.gov.br/node/194).

## Crawlers
Os crawlers são módulos responsáveis por analisar fonte de dados coletando informações relevantes sobre os dados a serem extraídos. 
Ele é importante para determinar quais dados devem ser coletados e quais já estão disponíveis no banco.
Atualmente, ele é responsável por chamar o scrapper, receber os novos dados (caso existam) e chamar o módulo de armazenamento no banco de dados.
Informações mais detalhadas podem ser encontradas dentro do diretório crawlers.

## Scrappers
Uma vez que o crawler determinar quais informações devem ser coletadas, o scrapper é acionado para fazer essa raspagem e tranformação do que foi obtido.
Este tem como principal objetivo conter a implementação que, não apenas colete os dados relevantes aos pescados, mas também as regras de negócio que adequem as informações para o "Data-Lake".
Informações mais detalhadas podem ser encontradas dentro do diretório scrappers.

## Módulos Adicionais
Há no projeto alguns módulos customizados para facilitar e abstrair a interação com o sistema de arquivos e a interação com o banco de dados.

#### file_utils.py
Este módulo contém toda a implementação que lida com a interação com o sistema de arquivos. 
Tarefas repetitivas como download, criação, remoção e movimentação de arquivos estão centralizadas neste script.

#### db_utils.py
Este módulo contém toda a lógica de interação e conexão com o banco de dados PostgreSQL. 
Tarefas de conexão, leitura e armazenamento de dados estão centralizadas nesse arquivo.

# Arquitetura geral de ETL
Nesta sessão é apresentado o diagrama mostrando o fluxo geral de dados dentro do processo de ETL.
![Arquitetura geral do processamento de dados](./img/arquitetura.png)

# Execução
Para a execução do ETL é recomendado o armazenamento dos logs de processamento.
Para isso, a maneira mais versátil e eficiente é rodar o comando:
```
python3 main.py > output_log.txt
```

# Como Adicionar Novos Crawlers e Scrappers
O projeto de etl foi pensado em separar o crawler do scrapper. Esta decisão foi baseada na experiência em coletar dados de diversas fontes diferentes tendo que monitorá-las diariamente para checar mudanças na fonte.
O que pude notar foi a constante mudança no layout da página web, mas não na disponibilização e/ou apresentação dos dados, ou seja, constantemente tinha que atualizar o **crawler** e poucas vezes tive que atualizar o **scrapper**.

Desta maneira, sempre que houver uma nova fonte de dados para ser adicionada no elt, primeiramente deve-se implementar o crawler utilizando a lógica apresentada na sessão [Crawlers](#crawlers).
Deve-se considerar como encontrar os dados na fonte, em que formato se encontram (tabela HTML, PDF, planilha, arquivos semiestruturados, entre outros), se estão compactados ou não, obter informações capazes de garantir que aquele dado foi ou não extraído anteriormente utilizando o banco de dados e chamar o scrapper no caso de haver dados novos para serem extraídos e salvá-los no banco de dados.

Uma vez implementado crawler, a próxima etapa é implementar o script para obtenção (raspagem) dos dados seguindo a lógica apresentada na sessão [Scrappers](#scrappers).

# Scheduler
Atualmente, todos os processos de extração automática de dados estão configurados para rodar automaticamente utilizando o crontab do linux.
Para mais informações sobre crontab e cron job, [este link](https://diolinux.com.br/tutoriais/entenda-o-que-e-cron-job.html) pode ajudar.

## etl_scheduler.txt
O arquivo *etl_scheduler.txt* é o crontab utilizado pelo módulo de etl.
Nele estão contidas informações sobre o horário e periodicidade de execução do *main.py*.
No caso, a periodicidade é para executar todos os dias às 04:00 da manhã (0 4 * * *).