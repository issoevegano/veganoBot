'use strict'
const express = require('express')
const bodyParser = require('body-parser')

const app = express()

const verificationController = require('./controllers/verification');
const messageWebhookController = require('./controllers/messageWebhook');
const apiSearchController = require('./controllers/apiSearch');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.set('port', (process.env.PORT || 5000))

app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})
//app.listen(5000, () => console.log('Webhook server is listening, port 5000'));

app.get('/', verificationController);
app.post('/', messageWebhookController);
app.post('/api-search', apiSearchController);
