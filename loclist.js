// http.js handles the HTTP requests
var delay = 5000;
var foo = require("./http.js");
var geo = require("./geo.js");

// The function tryToken sends a nextpage token to GMaps if a token exists in json response,
// looks for a nextpage token and calls itself again if there's a next page
// If there's no nextpage token, it ends the recursive loop
function tryToken(r,json,points,callback) {
	try {
		var token = json.next_page_token;
	} catch(e) {
		var token = '';
	}
	if (token!='' && token!=undefined) {
		// Delay is necessary for the API to work well
		setTimeout(function () { 
			// Perform request for next page, then append results to global points list
			foo.doHTTP2(token,function(r,json2) {
				Array.prototype.push.apply(points,json2.results);
				tryToken(r,json2,points,callback);
			});
		},delay);
	} else {
		callback(points);
	}
}

exports.getList = function(coords,radius,keyword) {
	var kwd = keyword || null;
	// First HTTP request does not need to be delayed
	setTimeout(foo.doHTTP(coords,radius,kwd,function(r,json) {
		points = json.results;
		tryToken(r,json,points,function(points) {
			console.log(kwd);
			var name; var lati; var loni; var type;
			for (i=0;i<points.length;i++) {
				name = points[i].name;
				lati = points[i].geometry.location.lat;
				loni = points[i].geometry.location.lng;
				type = points[i].types;
				console.log(name+" | "+lati+" | "+loni+" | "+type);
			}
			console.log(points.length);
		});
	}),delay);
};
