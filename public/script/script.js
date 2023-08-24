var periodo = $(".btn-periodo");
var data = $(".btn-data");
var svgData = $(".svg-calendar");
var selectYear = $("#year-select");
var inputPeriodo = $(".periodos");
var inputCalendario = $("#calendario");
var hamburguerMenu = $(".hamburguer-menu")
var navMenu = $(".container-links");
var btnLogin = $(".btn-login");
var activeFilter = $(".btn-mobile-filter");
var form = $("#filter-form");
var body = $("body");

data.on( "click", function() {
    if($(this).hasClass("disable")){
        data.removeClass("disable");
        periodo.addClass("disable");
        svgData.removeClass("disable");
        selectYear.addClass("disable");
        inputPeriodo.addClass("disable");
        inputCalendario.removeClass("disable");
        $("#datepicker").removeClass("disable");
        $(".dates").removeClass("disable");
    }
});

periodo.on( "click", function() {
    if($(this).hasClass("disable")){
        periodo.removeClass("disable");
        data.addClass("disable");
        selectYear.removeClass("disable");
        svgData.addClass("disable");
        inputPeriodo.removeClass("disable");
        inputCalendario.addClass("disable");
        $("#datepicker").addClass("disable");
        $(".dates").addClass("disable");
    }
});

$(".active-tab-pescados").on( "click", function() {
    $(".container-pescados").toggleClass("active");
    if(!$(".fade").hasClass("active")){
        $(".fade").addClass("active");
    }
});

$(".active-tab-periodo").on( "click", function() {
    $(".container-periodo").toggleClass("active");
    if(!$(".fade").hasClass("active")){
        $(".fade").addClass("active");
    }
});

$(".fade").on( "click", function() {
    $(".fade").toggleClass("active");
    if($(".container-periodo").hasClass("active")){
        $(".container-periodo").removeClass("active");
    }
    if($(".container-pescados").hasClass("active")){
        $(".container-pescados").removeClass("active");
    }
});

$(".fechar-filtro").on( "click", function() {
    form.toggleClass("active");
    body.toggleClass("hidden");
});

hamburguerMenu.on( "click", function() {
    $(this).toggleClass("active");
    navMenu.toggleClass("active");
    btnLogin.toggleClass("active");
    if(form.hasClass("active")){
        form.toggleClass("active");
    }else{
        body.toggleClass("hidden")
    }
});
activeFilter.on( "click", function() {
    form.toggleClass("active");
    body.toggleClass("hidden");
    $(window).scrollTop(0);
});

$(".btn-carregar").on( "click", function() {
    const container = document.querySelector(".container-tabela");    
    
    if(container.getAttribute("data-size") < $(".resultados-gerados tbody tr").length){
        var newValue = parseInt(container.getAttribute("data-size")) + 10;
        container.setAttribute("data-size", newValue);
    }
    
    container.style.overflowY = `hidden`;

    if(window.innerWidth < 1024){
         container.style.overflowX = `scroll`;
        container.style.maxHeight = `calc((37px * ${container.getAttribute("data-size")}) + 38px)`;
    }else if(window.innerWidth < 1301){
        container.style.maxHeight = `calc((33px * ${container.getAttribute("data-size")}) + 34px)`;
    }else{
        container.style.maxHeight = `calc((53px * ${container.getAttribute("data-size")}) + 57px)`;
    }
    
});

function disableDropDown(){
    $(".fade").removeClass("active");
    if($(".container-pescados").hasClass("active")){
        $(".container-pescados").removeClass("active");
    }
}

function exportarCSV() {
      const tabela = document.querySelector('.resultados-gerados');
      const linhas = tabela.getElementsByTagName('tr');
      const colunasCabecalho = tabela.getElementsByTagName('th');
      
      let csvContent = '';
      
      // Extrair os dados do cabeçalho
      const cabecalhoCSV = Array.from(colunasCabecalho)
        .map(coluna => coluna.innerText)
        .join(',');
      csvContent += cabecalhoCSV + '\n';

      // Extrair os dados das linhas
      for (const linha of linhas) {
        const colunas = linha.getElementsByTagName('td');
        const linhaCSV = Array.from(colunas)
          .map(coluna => coluna.innerText)
          .join(',');
        csvContent += linhaCSV + '\n';
      }

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;

      a.download = `DadosCotacoes-${$("#fontes")[0].value}.csv`;

      a.click();

      // Limpar a URL para liberar recursos
      URL.revokeObjectURL(url);
    }

$(".btn-exportar").on( "click", function() {
    exportarCSV()
});


// Gráfico

const data = [
    { date: "Jan", maxPrice: 15, minPrice: 10, avgPrice: 12 },
    { date: "Feb", maxPrice: 18, minPrice: 12, avgPrice: 15 },
    { date: "Mar", maxPrice: 20, minPrice: 15, avgPrice: 18 },
    // ... continue with data for the other months
  ];
  
  const chart = document.getElementById("chart");
  
  const labels = data.map(entry => entry.date);
  const maxPrices = data.map(entry => entry.maxPrice);
  const minPrices = data.map(entry => entry.minPrice);
  const avgPrices = data.map(entry => entry.avgPrice);
  
  const ctx = document.createElement("canvas");
  chart.appendChild(ctx);
  
  const chartConfig = {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Preço Máximo",
          data: maxPrices,
          borderColor: "#FF5733",
          fill: false,
        },
        {
          label: "Preço Mínimo",
          data: minPrices,
          borderColor: "#33AFFF",
          fill: false,
        },
        {
          label: "Preço Médio",
          data: avgPrices,
          borderColor: "#33FF33",
          fill: false,
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
    },
  };
  
  new Chart(ctx, chartConfig);
  
  