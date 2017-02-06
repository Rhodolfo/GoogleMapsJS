var list = require("./loclist.js");
var fs   = require('fs');
var geo  = require("./geo.js");

var con = fs.readFileSync("resources/keywords.txt","utf8").split("\n");
var coords = {lat:19.3694141,lon:-99.1630831};
for (i=0;i<con.length-1;i++) {
	list.getList(coords,10000,con[i],"base");
}
