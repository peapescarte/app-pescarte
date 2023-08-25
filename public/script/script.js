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
    var textAtual = $(".active-tab-pescados span").text();

    const pescados = $(".input-container-checkbox input").toArray();
      
      
    if(textAtual.includes(`Todos, `)){
        var newText = textAtual.replace(`Todos, `, "")
        $(".active-tab-pescados span").text(`${newText}`)
        
    }else if(textAtual.includes(`Todos`)){
        var newText = textAtual.replace(`Todos`, "Selecione os pescados: ")
        $(".active-tab-pescados span").text(`${newText}`)
        
    }else{
        $(".active-tab-pescados span").text("Todos")
        pescados.map(function(pescado) {
          if(pescado.checked){              
              $(`.input-container-checkbox #${pescado.name}`).prop('checked', false);
          }      
        });
    }
   
}
function insertPescadoInputName(pescadoName){
    
    var textAtual = $(".active-tab-pescados span").text();

    if(textAtual.includes(`${pescadoName},`)){
        var newText = textAtual.replace(`${pescadoName}, `, "")
        $(".active-tab-pescados span").text(`${newText}`)
        
    }else if(textAtual.includes(`, ${pescadoName}`)){
        var newText = textAtual.replace(`, ${pescadoName}`, '')
        $(".active-tab-pescados span").text(`${newText}`)
        
    }else if(textAtual.includes(pescadoName)){
        var newText = textAtual.replace(`${pescadoName}`, '')
        $(".active-tab-pescados span").text(`${newText}`)
        
    }else if(textAtual == "Selecione os pescados: "){
        $(".active-tab-pescados span").text(`${pescadoName}`)
    }else if(textAtual == ""){
        $(".active-tab-pescados span").text(`${pescadoName}`)
    }else{
        $(".active-tab-pescados span").text(`${textAtual}, ${pescadoName}`)
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