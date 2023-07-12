$(function() {
    $('#datepicker').datepicker({
        showOtherMonths: true,
        selectOtherMonths: true,
        dateFormat: 'dd/mm/yy',
        dayNamesMin: ['dom','seg','ter','qua','qui','sex','sáb'],
        monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
        onSelect: function(dateText) {
    $('#calendario').datepicker("setDate", $(this).datepicker("getDate"));
        }
    });
});

$(function() {
    $("#calendario").datepicker();
});