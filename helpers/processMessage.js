const token = process.env.FB_PAGE_ACCESS_TOKEN;
const API_AI_TOKEN = '2418b1ceb39b4edc8b7f1d4a21b62c7c'; //da conta do isso é vegano
const apiAiClient = require('apiai')(API_AI_TOKEN);


const request = require('request');

const sendTextMessage = (senderId, text) => {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: token },
        method: 'POST',
        json: {
            recipient: { id: senderId },
            message: { text },
        }
    });
};

const sendCard = (senderId, data) => {
    let dataElements = [];
    for(let i = 0; i< data.length; i++){
      dataElements.push({
        title: data[i].title,
        subtitle: data[i].subtitle,
        image_url: data[i].image_url,
      });
    }
    console.log("Data: " + dataElements);
    return request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: token },
        method: 'POST',
        json: {
            recipient: { id: senderId },
            message: {
              attachment: {
                type: "template",
                payload: {
                  template_type: "generic",
                  elements: dataElements
                }
              }
            }
        }
    });
};

function getUserProfile(userId) {
    return new Promise((resolve, reject) => {
        request({
                method: 'GET',
                uri: "https://graph.facebook.com/v2.6/" + userId + "?fields=first_name&access_token=" + token
            },
            function (error, response) {
                if (error) {
                    //console.error('Error while getUserProfile: ', error);
                    reject(error);
                } else {
                    //console.log('getUserProfile result: ', response.body);
                    resolve(response.body);
                }
            });
    });
}

module.exports = (event) => {
    const senderId = event.sender.id;
    const message = event.message.text;

    getUserProfile(senderId)
      .then((userInfo) => {
        const json = JSON.parse(userInfo);
        //console.log("Nome do user: " + json.first_name);
        let apiaiSession = apiAiClient.textRequest(message, {
          sessionId: 'issoevegano_bot',
          contexts: [{
            name: "generic",
            parameters: {
              facebook_user: json.first_name
            }
          }]
        });

        apiaiSession.on('response', (response) => {
            const result = response.result.fulfillment.messages[0].speech; // fulfillment.speech
            const data = response.result.fulfillment.data;
            console.log("Resultado de Data: "+ data);
            if (response.result.metadata.intentName === 'products.search') {
                if(data.length > 0){
                  sendCard(senderId, data);
                } else sendTextMessage(senderId, result);
            } else {
                sendTextMessage(senderId, result);
            }
        });

        apiaiSession.on('error', error => console.log(error));
        apiaiSession.end();
      }).catch(err=> {
        console.error(err);
      });
};
