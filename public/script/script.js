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
    }
});

$(".active-tab-pescados").on( "click", function() {
    $(".container-pescados").toggleClass("active");
});

$(".active-tab-periodo").on( "click", function() {
    $(".container-periodo").toggleClass("active");
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