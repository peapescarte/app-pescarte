# Scrapper
Os scrappers têm como principal funcionalidade fazer a extração e transformação dos dados para que eles estejam prontos para o armazenamento no banco.

## Organização
Dentro deste diretório serão criados arquivos **organizados por fonte de dados**, ou seja, cada arquivo deve implementar a lógica para a fonte específica.

# Fontes

## Pesagro
Este scrapper recebe como parâmetro de entrada o nome do arquivo txt gerado pelo [crawler](../crawlers/README.md#pesagro).
O script busca pelos dados de pescados e os armazena em listas.
Uma vez filtrados os dados, ele transforma essa lista em um pandas.DataFrame e faz todo o processo de limpeza e tradução dos nomes de pescados para a nomenclatura e siglas de referência que existe no banco de dados.

Após a limpeza dos dados, o dataframe é retornado para o crawler associado ao scrapper.