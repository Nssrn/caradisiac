const {getBrands} = require('node-car-api');
const {getModels} = require('node-car-api');
var fs = require('fs');

//Test function
async function Brands() {
 var brands = await getBrands();
 console.log(brands);
}
Brands();

//Import the data into a json file
async function populate () {
   const models = await getModels('PEUGEOT');
   var toString = "";
   var id = 0;

     models.forEach(function(element) {

  		toString += '{ "index":{ "_index": "suv", "_type" : "suv", "_id": "'+id+'"}}\n';
		toString += JSON.stringify(element)+"\n";
		id++;
	});

  fs.writeFile('data.json', toString, function (err) {
    if (err) throw err;
  });
 }

 populate();


