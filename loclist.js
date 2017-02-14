// http.js handles the HTTP requests
var delay = 10000;
var foo = require("./http.js");
var geo = require("./geo.js");
var fs  = require('fs');

exports.escapeChars = function(str) {
	var res = str.toString();
	res = res.replace(/\|/g,"<pipe>");
	res = res.replace(/#/g,"<hash>");
	res = res.replace(/'/g,"<squote>");
	res = res.replace(/"/g,"<dquote>");
	return res;
}

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

exports.getList = function(coords,radius,keyword,suffix,path) {
	if (radius<10) {console.log("Preventing overflow");process.exit();}
	var kwd  = keyword || null;
	// Define filename, check if it exists
	var file = path + "/" +(kwd+"_"+suffix).replace(/ /g,"_");
	var fext = fs.existsSync(file);
	// This is the function that is called if file name does not exist
	function first() {
		setTimeout(foo.doHTTP(coords,radius,kwd,function(r,json) {
			points = json.results;
			tryToken(r,json,points,function(points) {
				console.log("("+coords.lat+","+coords.lon+","+radius+") "+kwd+": "+points.length+" results");
				var name; var lati; var loni; var type; 
				var data = ""; var skip = "";
				var i = 0;
				for (i=0;i<points.length;i++) {
					name = exports.escapeChars(points[i].name);
					lati = exports.escapeChars(points[i].geometry.location.lat);
					loni = exports.escapeChars(points[i].geometry.location.lng);
					type = exports.escapeChars(points[i].types);
					plid = exports.escapeChars(points[i].place_id);
					data = data + skip + name+" | "+lati+" | "+loni+" | "+type+" | "+plid;
					if (skip==="") {skip = "\n";}
				}
				fs.writeFileSync(file);
				if (points.length>=60) {
					var subs = geo.getSubDisks(coords,radius);
					var i = 0;
					for (i=0;i<=6;i++) {
						setTimeout(function() {
							exports.getList(subs[i],Math.ceil(radius/2.0),kwd,suffix+"_"+i.toString(),path);
						},delay);
					}
				}
			});
		}),delay);
	};
	// This is the function that gets called if file exists but has a line count of 60
	function second() {
		console.log(file + " is a circle with 60 venues, checking for subcircles");
		var subs = geo.getSubDisks(coords,radius);
		var i = 0;

		for (i=0;i<=6;i++) {
			exports.getList(subs[i],Math.ceil(radius/2.0),kwd,suffix+"_"+i.toString(),path);
		}
	}
	// This is the function that gets called if file exists and has a line count of less than 60
	function third() {
		console.log(file + " is a circle with less than 60 venues, done with recursion");
	}
	if (fext) { // Count number of lines if file already exists, synchronously
		var lin = fs.readFileSync(file,"utf8").split("\n").length;
		if (lin<60) {
			third();
		} else {
			second();
		}
	} else {
		console.log(file + " has not been extracted, extracting");
		first();
	}
};
