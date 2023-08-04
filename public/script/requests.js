// ------------------------ SCRIPT PARA AS REQUISIÇÕES -----------------------------

const urlAPI = 'http://150.230.94.222:8000';

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

  fontes.map(function(fonte) {
      listFonts.append(`
        <option value="${fonte}">${fonte}</option>
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
  const containerPesc = $(".container-pescados");
  containerPesc.empty();
  containerPesc.append(`
        <div class="input-container-checkbox" onclick="disableDropDown()">
            <label for="Todos">Todos</label>
            <input type="checkbox" name="" id="Todos" data-value="">
        </div>
      `)
  arrayPesc.map(function(dados) {
      containerPesc.append(`
        <div class="input-container-checkbox">
            <label for="${dados.cod}">${dados.nome}</label>
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
    container.append(`
        <tr>
          <td>${dado.nome}</td>
          <td><span>R$ ${dado.minimo}</span> /kg</td>
          <td><span>R$ ${dado.mais_comum}</span> /kg</td>
          <td><span>R$ ${dado.maximo}</span> /kg</td>
        </tr>
    `)
    
  })
  $("#filter-form").removeClass("active");
  $(".fade").removeClass("active");
  $("body").removeClass("hidden");
}

$(".container-btns-forms").on( "click", function() {
    getDados();
});

initRequests();