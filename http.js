var request = require("request");
var apikey  = "";
var uri  = "https://maps.googleapis.com/maps/api/place/nearbysearch/json";

function request2GMaps(obj,callback) {
	request({url:uri, qs:obj}, function(err,response,body) {
		if(err) {
			console.log(err); 
			process.exit();
		}
		try {
			var json = JSON.parse(body);
		} catch(e) {
			console.log("Probably a connection error, error thrown:");
			console.log(e);
			console.log("Message response:");
			console.log(response);
			console.log("Message body:");
			console.log(body);
			process.exit();
		}
		if (!(json.status=== "OK"||json.status==="ZERO_RESULTS")) {
			console.log("GMaps has thrown an error:");
			console.log(uri);
			console.log(obj);
			console.log(json);
			process.exit();
		}
		callback(response,json);
	});
}

// No pagetoken HTTP request, it's the first call to any search
exports.doHTTP = function(coords,rad,kwd,callback) {
	var loc = coords.lat.toString() + "," + coords.lon.toString();
	var obj = {key:apikey,location:loc,radius:rad};
	if (!(kwd==="" || kwd===null)) {
		obj.keyword = kwd;
	}
	request2GMaps(obj,callback);
}

// Pagetoken HTTP request
exports.doHTTP2 = function(token,callback) {
	var obj  = {key:apikey,pagetoken:token};
	request2GMaps(obj,callback);
}
