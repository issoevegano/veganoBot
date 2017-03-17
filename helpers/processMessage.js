const token = 'EAAFMl1ZBQty4BAHXbV8pZCqAMcfk8fX14Evd6vmXfrZBs2PHLZBse9aF8YoGzKKRJaTSa2ia5hJsctfQiIZAkqnRJxfXhyli95VK5M7kOWHOaJ1HBG7pXZBniPXmDl6DL532ulZA2FmHXOmJpZAvKgNXVRTChfkfU24WagkRW7uJKgZDZD';
const CAT_IMAGE_URL = 'https://botcube.co/public/blog/apiai-tutorial-bot/hosico_cat.jpg';

const request = require('request');

module.exports = (event) => {
    const senderId = event.sender.id;
    const message = event.message.text;

    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: token },
        method: 'POST',
        json: {
            recipient: { id: senderId },
            message: {
                attachment: {
                    type: 'image',
                    payload: { url: CAT_IMAGE_URL}
                }
            }
        }
    });
};
