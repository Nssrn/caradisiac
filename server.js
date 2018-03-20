const {getBrands} = require('node-car-api');
const {getModels} = require('node-car-api');
var fs = require('fs');

//API configuration
var express = require('express'), 
app = express(),
port = 9292;

//Test function
async function Brands() {
 var brands = await getBrands();
 console.log(brands);
}
//Brands();

//Import the data into a json file
async function populate () {
   const brands = await getBrands();
   brands.forEach(async brand => {
	const models = await getModels(brand);
	var toString = "";
	var id = 0;
 
	  models.forEach(function(element) {
 
		 toString += '{ "index":{ "_index": "suv", "_type" : "suv", "_id": "'+id+'"}}\n';
		 toString += JSON.stringify(element)+"\n";
		 id++;
	 });
	 fs.writeFile('data.json', toString, async (err) => {
		if (err) throw err;

   });
	  });
  
 }
populate();

//API route 
app.get('/', (req,res) => {
	res.send('Test'); //Ok 
});
app.listen(port);

console.log("Server launch on port " + port);


 


