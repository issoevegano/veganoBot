//const GETTY_IMAGES_API_KEY = 'tap64ab6jcwfwh8zu3deaj98';

const request = require('request');

module.exports = (req, res) => {
    if (req.body.result.action === 'image') {
        const imageName = req.body.result.parameters['image_name'];
        const apiUrl = 'http://127.0.0.1:8000/products/?search=' + imageName;

        request.get(apiUrl, (err, response, body) => {
          if (!err && response.statusCode == 200) {
            const json = JSON.parse(body).results;
            var produtos = [];
            for(var i = 0; i < json.length; i++){
              produtos.push(json[i].name);
            }
            //var produtos = json[1].image;
            imageUri = produtos.toString();
            console.log("Resultado:" + imageUri);
            return res.json({
              speech: imageUri,
              displayText: imageUri,
              source: 'image_name'
            });
          } else{
            return res.status(400).json({
              status: {
                code: 400,
                errorType: 'Não consegui encontrar o produto que você deseja.'}});
          }
        })

        /*request({
            uri: apiUrl,
            methos: 'GET',
            headers: {'Content-type': 'application/json'}
        }, (err, response, body) => {
            const resul = JSON.parse(body).results;
            var imageUri = [];
            for(var i = 0; i < resul.length; i++){
              imageUri.push(resul[i].name);
            }
            console.log("Resultado:" + imageUri);
            //var show = imageUri.toString();
            return res.json({
                speech: imageUri,
                displayText: imageUri,
                source: 'image_name'
            });
        })*/
    }
}
