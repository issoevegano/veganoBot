const token = process.env.FB_PAGE_ACCESS_TOKEN;//'EAAFMl1ZBQty4BAHXbV8pZCqAMcfk8fX14Evd6vmXfrZBs2PHLZBse9aF8YoGzKKRJaTSa2ia5hJsctfQiIZAkqnRJxfXhyli95VK5M7kOWHOaJ1HBG7pXZBniPXmDl6DL532ulZA2FmHXOmJpZAvKgNXVRTChfkfU24WagkRW7uJKgZDZD';
const CAT_IMAGE_URL = 'https://botcube.co/public/blog/apiai-tutorial-bot/hosico_cat.jpg';

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

const sendImage = (senderId, imageUri) => {
    return request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: token },
        method: 'POST',
        json: {
            recipient: { id: senderId },
            message: { text: imageUri }
        }
    });
};


module.exports = (event) => {
    const senderId = event.sender.id;
    const message = event.message.text;

    const apiaiSession = apiAiClient.textRequest(message, {sessionId: 'issoevegano_bot'});

    apiaiSession.on('response', (response) => {
        const result = response.result.fulfillment.speech;

        if (response.result.metadata.intentName === 'images.search') {
            sendImage(senderId, result);
        } else {
            sendTextMessage(senderId, result);
        }
    });

    apiaiSession.on('error', error => console.log(error));
    apiaiSession.end();
};
