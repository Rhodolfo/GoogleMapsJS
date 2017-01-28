var request = require("request");
var apikey  = "KEYHERE";

// Headers don't seem to be required at all here
var head = {
	'Host': 'maps.googleapis.com', 
	'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:50.0) Gecko/20100101 Firefox/50.0',
	'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
	'Accept-Language': 'en-US,en;q=0.5',
	'Accept-Encoding': 'gzip, deflate, br',
	'Connection': 'keep-alive',
	'Upgrade-Insecure-Requests': '1',
	'Cache-Control': 'max-age=0'
};


// No pagetoken HTTP request, it's the first call to any search
exports.doHTTP = function(loc,rad,callback) {
	var path = "/maps/api/place/nearbysearch/json";
	var uri  = "https://maps.googleapis.com"+path;
	var obj  = {key:apikey,location:loc,radius:rad,name:""};
	request({url:uri, qs:obj}, function(err,response,body) {
		if(err) { console.log(err); return; }
		callback(response,body);
	});
}

// Pagetoken HTTP request
exports.doHTTP2 = function(token,callback) {
	var path = "/maps/api/place/nearbysearch/json";
	var uri  = "https://maps.googleapis.com"+path;
	var obj  = {key:apikey,pagetoken:token};
	request({url:uri, qs:obj}, function(err,response,body) {
		if(err) { console.log(err); return; }
		callback(response,body);
	});
}
