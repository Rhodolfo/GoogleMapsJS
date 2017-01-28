// http.js handles the HTTP requests
var foo = require("./http.js");
var points = [];
var delay = 5000;

// The function tryToken sends a nextpage token to GMaps if a token exists in json response,
// looks for a nextpage token and calls itself again if there's a next page
// If there's no nextpage token, it ends the recursive loop
function tryToken(r,json) {
	var token = '';
	try {
		token = json.next_page_token;
	} catch(e) {
		token = '';
	}
	if (token!='' && token!=undefined) {
		// Delay is necessary for the API to work well
		setTimeout(function () { 
			// Perform request for next page, then append results to global points list
			foo.doHTTP2(token,function(r,b) {
				var json2;
				try {
					json2 = JSON.parse(b);
					Array.prototype.push.apply(points,json2.results);
				} catch(e) {
					json2 = {};
				}
				tryToken(r,json2);
			});
		},delay);
	} else {
		var name; var lati; var loni; var type;
		for (i=0;i<points.length;i++) {
			name = points[i].name;
			lati = points[i].geometry.location.lat;
			loni = points[i].geometry.location.lng;
			type = points[i].types;
			console.log(name+" | "+lati+" | "+loni+" | "+type);
		}
	}
}

// First HTTP request does not need to be delayed
foo.doHTTP("19.3694141,-99.1630831","100",function(r,b) {
	var json;
	try {
		json = JSON.parse(b);
	} catch(e) {
		json = {};
	}
	points = json.results;
	tryToken(r,json);
});
