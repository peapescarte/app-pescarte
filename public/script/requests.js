// ------------------------ SCRIPT PARA AS REQUISIÇÕES -----------------------------
// Fazendo a requisição GET para obter o token
fetch('http://140.238.190.50:8000/auth', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
})
  .then(response => response.json())
  .then(token => {
    // Manipule a resposta da requisição aqui
    console.log(token)
    // Fazendo a requisição GET com o token de autenticação
    fetch('http://140.238.190.50:8000/datafonte', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        // Manipule a resposta da requisição aqui
        console.log(data);
          insertData(data.data.data)
          insertFonte(data.fontes)
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