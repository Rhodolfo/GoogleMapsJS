var list = require("./loclist.js");
var fs   = require('fs');
var geo  = require("./geo.js");

var con = fs.readFileSync("resources/keywords.txt","utf8").split("\n");
//var coords = {lat:19.3694141,lon:-99.1630831};
//var coords = {lat:21.861844061324184,lon:-102.332241427149199};
var coords = {lat:19.498183405203513,lon:-99.030422841090925};
list.getList(coords,50000,null,"null","data");
