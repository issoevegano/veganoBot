const request = require('request');

module.exports = (req, res) => {
    if (req.body.result.action === 'product') {
        const productName = req.body.result.parameters['product_name'];
        const apiUrl = 'https://issoevegano-api.herokuapp.com/products/?search=' + productName;

        request.get(apiUrl, (err, response, body) => {
          if (!err && response.statusCode == 200) {
            const json = JSON.parse(body).results;
            var products = [];
            var names = [];
            for(var i = 0; i < json.length; i++){
              names.push(json[i].name);
              products.push({
                title: json[i].name,
                image_url: json[i].image,
                subtitle: json[i].note
              });
            }
            //var products = json[1].image;
            productsName = names.toString();
            console.log("Resultado:" + productsName);
            return res.json({
              speech: productsName,
              displayText: productsName,
              data: products,
              source: 'product_name'
            });
          } else{
            return res.status(400).json({
              status: {
                code: 400,
                errorType: 'Não consegui encontrar o produto que você deseja.'}});
          }
        })
    } else if(req.body.result.action === 'brand'){
      const brandName = req.body.result.parameters['brand_name'];
      const apiUrl = 'https://issoevegano-api.herokuapp.com/products/?search=' + brandName;

      request.get(apiUrl, (err, response, body) => {
        if (!err && response.statusCode == 200) {
          const json = JSON.parse(body).results;

          var products = [];
          for(var i = 0; i < json.length; i++){
            products.push(json[i].name);
          }

          let brandIsVegan = "";
          if(products[0] == undefined){
            brandIsVegan = "";
          } else brandIsVegan = "Sim, é vegano";
          //var products = json[1].image;
          //productUri = products.toString();
          console.log("Resultado:" + brandIsVegan);
          return res.json({
            speech: brandIsVegan,
            displayText: brandIsVegan,
            source: 'brand_name'
          });
        } else{
          return res.status(400).json({
            status: {
              code: 400,
              errorType: 'Não consegui encontrar o produto que você deseja.'}});
        }
      })
    }
}
