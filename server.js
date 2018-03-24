const {getBrands} = require('node-car-api');
const {getModels} = require('node-car-api');
var fs = require('fs');

//API configuration
var express = require('express'), 
app = express(),
port = 9292;

// Add the Elasticsearch module
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
	host: 'localhost:9200'
});

//Check if everthing is ok
client.ping({
	requestTimeout: 30000,
}, function(error) {
	if (error) {
		console.error('elasticsearch cluster is down!');
	} else {
		console.log('Everything is ok');
	}
});

function Indexing(toString)
{
	client.bulk({
		body: [toString]
	});
}

//Test function
async function Brands() {
 var brands = await getBrands();
 console.log(brands);
}
//Brands();

/**
 * endpoint /populate
 */
async function populate () {
	var brands = await getBrands();
	var toString = "";
	var id = 0;
	var array = [];
	
	for(var i =0; i < 30; i++) // brands.length
	{
		var brand = brands[i];
		array[i] = new Promise(function(resolve, reject)
		{
			getModels(brand).then(function(models)
			{
		
				models.forEach(function(element)
				{
					try {
						element.volume = parseInt(element.volume);
					}
					catch(error) {
						console.error(error);
					}
					toString += '{ "index":{ "_index": "suv", "_type":"suv", "_id": "'+id+'"} }\n';
					toString += JSON.stringify(element)+"\n";
					id++;
					hasInsert = true;
				});	
				
		    });
		});
	}

	Promise.all(array).then(function(data) {
		
		console.log("Data loaded");
	    fs.writeFile('data.json', toString, function (err) {
			if (err) throw err;
		});
		
	});
}
//populate();

/**
 * Search the max volume of the suv, sort descending
 */
function search()
{
	//Show 10 hits
	return client.search({
	    index: "suv",
	    type: 'suv',
	    body: {
	       sort: [{ "volume": { "order": "desc" } }],
	       size: 10,
	    }
 	});
}

//API route 
app.get('/', (req,res) => {
	res.send('GET /populate to index records to ElasticSearch ; GET /suv to return a list of the best suv (with a higher volume)'); //Ok 
});


app.get('/populate', (req, res) => {
	populate();
    res.send('Indexing... ');
});

app.get('/suv', (req, res) => {
	
	search().then(function(resp)
	{
    	res.send(resp);
	})
	.catch(function(error) {
		res.send(error);
	});
});

app.listen(port);

console.log("Magic happens on port " + port);


 


