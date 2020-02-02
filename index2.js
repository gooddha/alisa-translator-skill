const names = [];
let userName = '';
let userAge = 0;


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

  let text = 'Привет, я переводчик.\nНапиши слово на русском языке.';


  if (request['original_utterance'] > 0) {
    names.push(request['original_utterance']);
    userName = request['original_utterance'];
    text = 'Привет, ' + request['original_utterance'];
  } else if (session['message_id'] !== 0) {
    text = "Такого имени не бывает, как тебя зовут?"
  }

  if (userName) {
    text = text + '\n Сколько тебе лет?';
  }



  if(request.command === 'С кем ты общалась?') {
    if (names.length > 0) {
      text = names.toString();

    } else {
      text = 'Пока ни с кем. Как твоё имя?';
    }
  }



  return {
      version,
      session,
      response: {
          text: text,
          userName: userName,
          userAge: userAge,
          names: names.toString(),
          end_session: true,
      },
  };
};