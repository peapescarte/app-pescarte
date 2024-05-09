// ------------------------ SCRIPT PARA AS REQUISIÇÕES -----------------------------

const urlAPI = 'https://cota-pesca.pescarte.org.br';

let globalPescadosData = [];
let chartRendered = false;

function initRequests() {
    fetch(`${urlAPI}/auth`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(token => {
      // Fazendo a requisição GET com o token de autenticação
      getDataFonte(token)
    })
    .catch(error => {
      // Lida com erros da requisição
      console.error('Erro na requisição:', error);
    });
}

function getDataFonte(token) {
    fetch(`${urlAPI}/datafonte`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        // Manipule a resposta da requisição aqui
          insertData(data.data.data)
          insertFonte(data.fontes)
      })
      .catch(error => {
        // Lida com erros da requisição
        console.error('Erro na requisição:', error);
      });
}

function insertData(currentDate) {
    const date = document.querySelector(".container-date h3 span");

    date.innerText = formatDate (currentDate);    
}

function formatDate (input) {
  var datePart = input.match(/\d+/g),
  year = datePart[0],
  month = datePart[1], day = datePart[2];

  return day+'/'+month+'/'+year;
}

function insertFonte(fontes) {
  const listFonts = $("#fontes")

  var fonteUpper = ''

  fontes.map(function(fonte) {
      fonteUpper = fonte.toUpperCase()
      listFonts.append(`
        <option value="${fonte}">${fonteUpper}</option>
      `)
  });
}
function getPescados() {
  var dataUrl = convertDate();
  var fonte = $("#fontes")[0].value;
  var urlRequest = fonte != "" ? `${urlAPI}/cotPescados/pescados?fonte=${fonte}&${dataUrl}` 
                    : `${urlAPI}/cotPescados/pescados?${dataUrl}` ;
  //data=2012-07-26
  
  fetch(`${urlAPI}/auth`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(token => {
       fetch(`${urlRequest}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
        })
        .then(response => response.json())
        .then(pescados => {
          // Manipule a resposta da requisição aqui
          if(pescados.length == 0){
            alert("Nenhum pescado encontrado, selecione outra data!");
            $(".active-tab-pescados").css("pointer-events", "none")
          }else{
            $(".active-tab-pescados").css("pointer-events", "auto")
            insertPescados(pescados)
          }
          
        })
        .catch(error => {
          // Lida com erros da requisição
          console.error('Erro na requisição:', error);
        });
    })
    .catch(error => {
      // Lida com erros da requisição
      console.error('Erro na requisição:', error);
    });
}

function insertPescados(arrayPesc) {
  globalPescadosData = arrayPesc;
  const containerPesc = $(".container-pescados");
  containerPesc.empty();
  containerPesc.append(`
        <div class="input-container-checkbox">
            <label for="Todos" onclick="disableDropDown()">Todos</label>
            <input type="checkbox" name="" id="Todos" data-value="">
        </div>
      `)
  arrayPesc.map(function(dados) {
      containerPesc.append(`
        <div class="input-container-checkbox">
            <label for="${dados.cod}" onclick="insertPescadoInputName('${dados.nome}')">${dados.nome}</label>
            <input type="checkbox" name="${dados.cod}" id="${dados.cod}" data-value="${dados.cod}">
        </div>
      `)
  });
}

function convertDate() {
  var dataIni = $("#start_date")[0].value;
  var dataFim = $("#end_date")[0].value;
  
  
  var dataUrl = ''
    if(dataIni.includes("De:")){
      dataIni = dataIni.replace("De: ", "")
      dataIni = converterFormatoData(dataIni);
      dataFim = dataFim.replace("Até: ", "")
      dataFim = converterFormatoData(dataFim);
      dataUrl = `inicio=${dataIni}&fim=${dataFim}`
    }else{
      dataIni = converterFormatoData(dataIni);
      dataUrl = `inicio=${dataIni}&fim=${dataIni}`
    }

  return dataUrl;
}

function converterFormatoData(data) {
  // Divide a data em dia, mês e ano
  const partesData = data.split('/');
  const dia = partesData[0];
  const mes = partesData[1];
  const ano = partesData[2];

  // Monta a nova data no formato aaaa-mm-dd
  const novaData = `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
  return novaData;
  
}
function getDados() {
  const pescados = $(".input-container-checkbox input").toArray();
  var urlPescados = "";
  
  pescados.map(function(pescado) {
      if(pescado.checked){
          urlPescados += `&pescado=${pescado.name}`
      }      
  });

  var dataUrl = convertDate();
  var fonte = $("#fontes")[0].value;
  var urlRequest = `${urlAPI}/cotPescados/precos?fonte=${fonte}&${dataUrl}${urlPescados}`;
  
  fetch(`${urlAPI}/auth`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(token => {
       fetch(`${urlRequest}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
        })
        .then(response => response.json())
        .then(pescados => {
          // Manipule a resposta da requisição aqui
          insertResult(pescados)
        })
        .catch(error => {
          // Lida com erros da requisição
          console.error('Erro na requisição:', error);
        });
    })
    .catch(error => {
      // Lida com erros da requisição
      console.error('Erro na requisição:', error);
    });
}

$(".resultados-gerados").on("click", ".fas.fa-times", function(e) {
    e.stopPropagation(); // Impede a propagação do evento
    
    const chartContainer = $("#container");
    
    chartContainer.empty().hide(); 
    $(this).hide();
    $(this).siblings('.fas.fa-chart-line').show();
});

$(".resultados-gerados").on("click", ".fas.fa-chart-line", function(e) {
    e.stopPropagation();

    const dataId = $(this).attr("data-id");
    const nome = $(this).closest('td').text().trim();
    const chartContainer = $("#container");

    // Esconde todos os gráficos e ícones de fechar.
    $('.resultados-gerados .fas.fa-times').hide();
    chartContainer.empty().hide();

    // Mostra todos os ícones de gráficos.
    $('.resultados-gerados .fas.fa-chart-line').show();

    // Lógica para exibir o novo gráfico.
    requestMedias(dataId, nome); 
    chartContainer.show();
    $(this).siblings('.fas.fa-times').show();
    $(this).hide();
});



function insertResult(params) {
    const container = $(".resultados-gerados tbody");

    container.empty();
    container.append(`
        <tr>
          <th>Nome</th>
          <th>Mínimo</th>
          <th>Mais Comum</th>
          <th>Máximo</th>
        </tr>
    `)
    params.map(function(dado) {
    const cod = findCodForNome(dado.nome);
    container.append(`
        <tr>
          <td>
              ${dado.nome} 
              <i class="fas fa-chart-line" data-id="${cod}" style="cursor: pointer;"></i> 
              <i class="fas fa-times close-chart" data-id="${cod}" style="cursor: pointer; display: none;"></i>
              <span class="displayed-name"></span>
              <div id="chart-${cod}" style="display: none;"></div>
          </td>
          <td><span>R$ ${dado.minimo}</span> /kg</td>
          <td><span>R$ ${dado.mais_comum}</span> /kg</td>
          <td><span>R$ ${dado.maximo}</span> /kg</td>
        </tr>
    `)
  });

  $("#filter-form").removeClass("active");
  $(".fade").removeClass("active");
  $("body").removeClass("hidden");
}

$(".container-btns-forms").on( "click", function() {
    getDados();
});


function findCodForNome(nome) {
    const pescado = globalPescadosData.find(p => p.nome === nome);
    return pescado ? pescado.cod : null;
}

function getDatesForMedias() {
    const today = new Date();
    const lastYear = new Date(today);
    lastYear.setFullYear(today.getFullYear() - 1);

    const formatDate = (date) => {
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    };

    return {
        dataInicio: formatDate(lastYear),
        dataFim: formatDate(today)
    };
}

function requestMedias(codPescado, nome) {
    const { dataInicio, dataFim } = getDatesForMedias();

    // Create a query string using the provided data.
    const queryString = `dataInicio=${dataInicio}&dataFim=${dataFim}&codPescado=${codPescado}`;

    fetch(`${urlAPI}/auth`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(token => {
        return fetch(`${urlAPI}/cotPescados/medias?${queryString}`, {  // Notice the added query string here
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
    })
    .then(response => response.json())
    .then(data => {
        const processedData = transformDataForChart(data);
        createChart(processedData, nome);
    })
    .catch(error => {
        console.error('Erro na requisição:', error);
    });
}




function transformDataForChart(data) {

    const today = new Date();
    const currentMonthIndex = today.getMonth();
    
    const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    // Pega os meses até o mês atual
    const monthsUntilNow = months.slice(0, currentMonthIndex + 1);
    
    return monthsUntilNow.map(month => [
        month,
        data[month] && data[month].media_maximo || 0,
        data[month] && data[month].media_minimo || 0,
        data[month] && data[month].media_mais_comum || 0
    ]);
}

function createChart(data, nome) {
    // create a data set
    var dataSet = anychart.data.set(data);

    // map the data for all series
    var firstSeriesData = dataSet.mapAs({x: 0, value: 1});
    var secondSeriesData = dataSet.mapAs({x: 0, value: 2});
    var thirdSeriesData = dataSet.mapAs({x: 0, value: 3});

    // create a line chart
    var chart = anychart.line();


    // create the series and name them
    var firstSeries = chart.line(firstSeriesData);
    firstSeries.name("Valor máximo");
    var secondSeries = chart.line(secondSeriesData);
    secondSeries.name("Valor mínimo");
    var thirdSeries = chart.line(thirdSeriesData);
    thirdSeries.name("Valor médio");

    // Formatando o eixo y
    var yAxis = chart.yAxis();
    yAxis.labels().format('R$ {%Value}');
  
    // Formatando o tooltip
    firstSeries.tooltip().format('Valor Máximo: R$ {%Value}');
    secondSeries.tooltip().format('Valor Mínimo: R$ {%Value}');
    thirdSeries.tooltip().format('Valor Médio: R$ {%Value}');


    // add a legend
    chart.legend().enabled(true);

    // add a title
    chart.title(nome);

    // specify where to display the chart
    chart.container("container");

    // draw the resulting chart
    chart.draw();

    chartRendered = true;
}


initRequests();