var express = require('express');
var request = require('request');

var router = express.Router();

var apiKey = "59cbaf20e3e06d3565778e7ba325dc6fbc42476ca703937feaff4eb1";
var rootURL = "http://api.ft.com/content/search/v1?eu";
var rerouteCors = "http://localhost:3001";

var headers = {'X-Api-Key': apiKey, 'Content-Type': 'application/json', 'Target-URL': rootURL};

var data =  {
  "queryString": "Theresa May"
};

var options = {  
    url: rerouteCors,
    method: 'POST',
    headers: headers,
    body: data,
    json: true
};

/* GET home page. */
router.get('/', function(req, res, next) {

	var myPromise = new Promise(function(resolve,reject){
		request(options, function(err, res, body) {
		    console.log(body.results);
		});
	}).then(function(data){
		console.log(data);
  	res.render('index', { title: 'Express' });
	});




});

module.exports = router;