
const getContent = function(url) {

  return new Promise((resolve, reject) => {

    const lib = url.startsWith('https') ? require('https') : require('http');
    const request = lib.get(url, (response) => {

      if (response.statusCode < 200 || response.statusCode > 299) {
         reject(new Error('Failed to load page, status code: ' + response.statusCode));
       }

       const body = [];

       response.on('data', (chunk) => body.push(chunk));

       response.on('end', () => resolve(body.join('')));
    });

    request.on('error', (err) => reject(err))
    })
};


let lang = 'en';
const langs = {
  'английский': 'en',
  'немецкий': 'de',
  'французский': 'fr'
};
let phrase = '';
let state = 0;
let lastPhrase = '';



/**
 * Entry-point for Serverless Function.
 *
 * @param event {Object} request payload.
 * @param context {Object} information about current execution context.
 *
 * @return {Promise<Object>} response to be serialized as JSON.
 */
module.exports.handler = async (event, context) => {
  const {version, session, request} = event;

  let text = `Привет, я переводчик с русского языка на английский.\nЧто будем переводить?`;

  if (!lang && state === 0) {
    request.nlu.tokens.forEach((token) => {
      if (langs[token]) { 
        lang = langs[token];
        state = 1;
        lastPhrase = request['original_utterance'];
      } else {
        text = 'Я не знаю этого языка, выбери другой';
      }
    });
  }
  let phrase = '';
  
  if (!phrase) {      
    phrase = request['original_utterance'];

  }

  const res = await getContent(`https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20200201T120357Z.f7ccf6a45cf7e25b.61b825a926241e0677746a4806868edc997dae6a&text=${phrase}&lang=en&format=plain`);
  
  text = JSON.parse(res).text[0];
    
  return {
    version,
    session,
    response: {
      text: text,
      end_session: false,
    },
  };  
};
