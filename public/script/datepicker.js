$(function(){
    var MultiDate = {
      datepickerDiv: "#datepicker",
      startDateField: "#start_date",
      endDateField: "#end_date",
      clearButton: "#clear",
      startDate: null,
      endDate: null,
      clearEndWhenSelectingStart: true,
      disableOutsideDates: false,
      numberOfMonths: 1,
      
      // Set either the start or the end date
      _changeDate: function(){
        var date = this.value;
        var startDate = MultiDate.startDate;
        var endDate = MultiDate.endDate;
        var dateTime = moment(MultiDate._convertStringToJSDate(date));
        if(startDate && dateTime.isSame(startDate)) {
          MultiDate._clearStartDate();
        } else if (endDate && dateTime.isSame(endDate)) {
          MultiDate._clearEndDate();
        } else if(startDate && dateTime.isBefore(startDate)) {
          MultiDate.setStartDate(date);
        } else if (endDate && dateTime.isAfter(endDate)) {
          MultiDate.setEndDate(date);
        } else if (startDate && !endDate) {
          MultiDate.setEndDate(date);
        } else {
          MultiDate.setStartDate(date);
        }
      },
      
      _updateStartDateEvent: function(e) {
        var date = MultiDate._convertStringToJSDate(e.target.value, true);
        if(date !== MultiDate.startDate) {
          MultiDate.startDate = date;
          MultiDate.$datepicker.datepicker("refresh");
          MultiDate.moveToFirstDay();
        }
      },
      
      _updateEndDateEvent: function(e) {
        var date = MultiDate._convertStringToJSDate(e.target.value, true);
        if(date !== MultiDate.endDate) {
          MultiDate.endDate = date;
          MultiDate.$datepicker.datepicker("refresh");
        }
      },
      
      // Clear the end date
      _clearEndDate: function(){
        MultiDate.endDate = null;
        MultiDate.$endDate.val("");
        if(MultiDate.disableOutsideDates) {
          MultiDate.$datepicker.datepicker("option", "maxDate", "");
        }
      },
      
      _clearStartDate: function(){
        MultiDate.startDate = null;
        MultiDate.$startDate.val("");
        if(MultiDate.disableOutsideDates) {
          MultiDate.$datepicker.datepicker("option", "minDate", "");
        }
      },
      
      _convertStringToJSDate: function(date, asMoment) {
        asMoment = asMoment || false;
        if(date) {
          var split = date.split("/");
          var day = split[0];
          var month = split[1] - 1;
          var year = split[2];
          if(asMoment) {
            return moment(new Date(year, month, day));
          } else {
            return new Date(year, month, day);
          }
        } else {
          return null;
        }
      },
      
      _shouldDateBeSelected: function(date){
        var startDate = MultiDate.startDate;
        var endDate = MultiDate.endDate;
        if(!moment.isMoment(date)) {
          date = moment(date);
        }
        if(startDate && endDate && date.isSameOrAfter(startDate) && date.isSameOrBefore(endDate)) {
          return true;
        } else if (startDate && date.isSame(startDate) || endDate && date.isSame(endDate)) {
          return true;
        } else {
          return false;
        }
      },
      
      _disableInputs: function(){
        MultiDate.$startDate[0].disabled = true;
        MultiDate.$endDate[0].disabled = true;
      },
      
      _enableInputs: function(){
        MultiDate.$startDate[0].disabled = false;
        MultiDate.$endDate[0].disabled = false;
      },
      
      _clearDatesEvent: function(e){
        e.preventDefault();
        MultiDate._clearStartDate();
        MultiDate._clearEndDate();
        MultiDate._enableInputs();
        MultiDate.$datepicker.datepicker("refresh");
      },
      
      sendDatesToInputs: function(){
        if(MultiDate.startDate) {
          MultiDate.$startDate.val("De: " + MultiDate.startDate.format("DD/MM/YYYY"));
        }
        if(MultiDate.endDate) {
          MultiDate.$endDate.val("Até: " + MultiDate.endDate.format("DD/MM/YYYY"));
          $(".container-periodo").removeClass("active");
          getPescados()  
        }
      },
      
      setStartDate: function(value, keepEndDate){
        keepEndDate = keepEndDate || false;
        if(!keepEndDate && MultiDate.clearEndWhenSelectingStart) {
          MultiDate._clearEndDate();
        }
        MultiDate.startDate = moment(MultiDate._convertStringToJSDate(value));
        MultiDate.sendDatesToInputs();
        if(MultiDate.disableOutsideDates) {
          MultiDate.$datepicker.datepicker("option", "minDate", value);
        }
      },
      
      setEndDate: function(value){
        MultiDate.endDate = moment(MultiDate._convertStringToJSDate(value));
        MultiDate.sendDatesToInputs();
        if(MultiDate.disableOutsideDates) {
          MultiDate.$datepicker.datepicker("option", "maxDate", value);
        }
      },
      
      moveToFirstDay: function(){
        if(MultiDate.startDate) {
          MultiDate.$datepicker.datepicker("setDate", MultiDate.startDate.toDate());
        }
      },
      
      getNumberOfCalendars() {
        var windowWidth = window.innerWidth;
        var numberOfCalendars = 1;
        return numberOfCalendars;
      },
      
      resizeCalendar() {
        var currentNumber = MultiDate.numberOfMonths;
        var newNumber = MultiDate.getNumberOfCalendars();
        if(currentNumber !== newNumber) {
          MultiDate.$datepicker.datepicker('option', "numberOfMonths", newNumber);
          MultiDate.numberOfMonths = newNumber;
          MultiDate.moveToFirstDay();
        }
      },
      
      init: function(){
        var numberOfMonths = MultiDate.getNumberOfCalendars();
        MultiDate.datePickerSettings = {
          beforeShowDay: function(date){
            var className = MultiDate._shouldDateBeSelected(date) ? "active" : "";
            return [true, className];
          },
          numberOfMonths: numberOfMonths,
          dateFormat: "dd/mm/yy",
          showOtherMonths: true,
        selectOtherMonths: true,
        dateFormat: 'dd/mm/yy',
        dayNamesMin: ['dom','seg','ter','qua','qui','sex','sáb'],
        monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
        };
        // Setting elements
        MultiDate.$startDate = $(MultiDate.startDateField);
        MultiDate.$endDate = $(MultiDate.endDateField);
        MultiDate.$clear = $(MultiDate.clearButton);
        // Binding Datepicker
        MultiDate.$datepicker = $(MultiDate.datepickerDiv).datepicker(MultiDate.datePickerSettings);
        MultiDate.$datepicker.on("change", MultiDate._changeDate);
        // Binding inputs
        MultiDate.$startDate.on("blur", MultiDate._updateStartDateEvent);
        MultiDate.$endDate.on("blur", MultiDate._updateEndDateEvent);
      }
    }
    
    MultiDate.init();
    window.MultiDate = MultiDate;
    window.addEventListener("resize", MultiDate.resizeCalendar);

    $("#js--periodos span").on( "click", function() {
        MultiDate._clearEndDate();
        switch ($(this)[0].innerHTML) {
        case "Páscoa":
            dataPascoa($("#year-select")[0].value);
            break;
        case "Natal":
            const dataAtual = new Date();
            const anoAtual = dataAtual.getFullYear();
                
            if($("#year-select")[0].value == anoAtual){
                insertDateInput(`25/12/${$("#year-select")[0].value - 1}`);
            }else{
                insertDateInput(`25/12/${$("#year-select")[0].value}`);
            }
            break;
        case "Réveillon":
            const data2Atual = new Date();
            const ano2Atual = data2Atual.getFullYear();
                
            if($("#year-select")[0].value == ano2Atual){
                insertDateInput(`31/12/${$("#year-select")[0].value - 1}`);
            }else{
                insertDateInput(`31/12/${$("#year-select")[0].value}`);
            }
            break;
        case "Semana Santa":
            dataSextaFeiraSanta($("#year-select")[0].value);
            break;
        default:
            console.log("Dia inválido");
            break;
        }
        $(".container-periodo").toggleClass("active");
        $(".fade").toggleClass("active");
        getPescados();
    });
  });

function dataSextaFeiraSanta(ano) {
    const dataPascoa = calcularDataPascoa(ano);
    const dataSextaFeiraSanta = new Date(dataPascoa);
    dataSextaFeiraSanta.setDate(dataPascoa.getDate() - 2); // Sexta-feira Santa é dois dias antes da Páscoa
    
    insertDateInput(dataSextaFeiraSanta.toLocaleDateString())
}
function dataPascoa(ano) {
    const dataPascoa = calcularDataPascoa(ano);
    insertDateInput(dataPascoa.toLocaleDateString())
}

  function calcularDataPascoa(ano) {
    // Algoritmo de Meeus/Jones/Butcher para calcular a data da Páscoa
    const a = ano % 19;
    const b = Math.floor(ano / 100);
    const c = ano % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const n = Math.floor((h + l - 7 * m + 114) / 31);
    const p = (h + l - 7 * m + 114) % 31;
    const dia = p + 1;
    const mes = n;
    return new Date(ano, mes - 1, dia); // O mês em JavaScript começa a partir de 0 (janeiro é 0)
  }

function insertDateInput(data){
    $("#start_date").val(data)
}