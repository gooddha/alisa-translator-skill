const https = require('https');
let text = '';
let userInput = 'Привет';

https.get(`https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20200201T120357Z.f7ccf6a45cf7e25b.61b825a926241e0677746a4806868edc997dae6a&text=${userInput}&lang=ru-de&format=plain`, (resp) => {
  let data = '';

  resp.on('data', (chunk) => {
    data += chunk;
  });

  resp.on('end', () => {
    text = JSON.parse(data).text[0];
  })
  
}).on('error', (e) => {
  text = e.message;
})

setTimeout(() => console.log(text), 1000);