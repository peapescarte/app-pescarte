# Crawler
Os crawlers têm como principal funcionalidade buscar por dados relevantes de pescados de diferentes fontes disponíveis.
Eles são responsáveis por verificar se os dados disponíveis já foram coletados e se há novas informações que devem ser obtidas pela automação.
Caso ele determine que haja dados para coleta, ele chama o scrapper associado a fonte de dados para que seja feita a raspagem dos arquivos ou dos sites que disponibilizam as cotações de pescados.

# Organização
Dentro deste diretório serão criados arquivos **organizados por fonte de dados**, ou seja, cada arquivo deve implementar a lógica para a fonte específica.

# Fontes

## Pesagro
O crawler pesagro contém toda a lógica para a busca de links para download de arquivos zip e pdf da fonte de dados.
Para toda a execução, ele baixa todos os arquivos verificando por cada pdf se esse mesmo já foi extraído para o banco de dados.
Essa estratégia garante que as informações sempre estarão atualizadas depois de cada execução.

### Particularidades
Para a garantia da integridade dos dados, uma ferramenta terceira é utilizada para transformar o arquivo pdf em txt.

#### pdftotext
Uma vez avaliado que o pdf contém informações novas que devem ser extraídas, o primeiro passo que o crawler executa é o download do pdf e a conversão dele para txt utilizando o **pdftotext**.
Para a instalação da ferramenta (testado em Ubuntu):
```
sudo apt install poppler-utils
```

O comando bash para converter pdf para txt é:
```
pdftotext -layout <pdf file> <txt file>
```

Todo esse processo de conversão está automatizado para a fonte do pesagro.

### Arquivos intermediários
Todos os arquivos intermediários que são utilizados para o processamento e análise dos dados (pdf e txt) são armazenados em um diretório temporário que é automaticamente deletado ao final do processamento.

### Final do processamento
No final do processamento, todos os arquivos pdf que não permitiram a extração dos dados serão armazenados em um diretório chamado *files_with_errors* para posterior inspeção.

### Erros comuns encontrados nos PDFs
*   Data inconsistente (ex. 00/07/2021);
*   Arquivo cortado ao meio (faltando informações);
*   Arquivo com data repetida.

O último caso, data repetida, impede o armazenamento das informações pois viola as contraints de unicidade do banco de dados.
