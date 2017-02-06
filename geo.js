var R  = 6371000; // Earth's radius in meters
var pi = 4.0*Math.atan(1.0); // Pi radius

function toRad(ang) {
	return ang*(pi/180.0);
};

function toDeg(ang) {
	return ang*(180.0/pi);
};

// Coords in degrees, bearing in degrees too (measured from North)
// http://www.movable-type.co.uk/scripts/latlong.html
exports.destPoint = function(coords,d,bearing) {
	var phi1 = toRad(coords.lat);
	var lam1 = toRad(coords.lon);
	var brng = toRad(bearing);
	var phi2 = Math.asin(Math.sin(phi1)*Math.cos(d/R) + Math.cos(phi1)*Math.sin(d/R)*Math.cos(brng));
	var lam2 = lam1 + Math.atan2(Math.sin(brng)*Math.sin(d/R)*Math.cos(phi1),Math.cos(d/R)-Math.sin(phi1)*Math.sin(phi2));
	return {lat:toDeg(phi2),lon:toDeg(lam2)}
}

// Gives back circle centers that would cover original circle but with radius/2
// https://en.wikipedia.org/wiki/Disk_covering_problem
// Graphical representation:
//     1
//  6     2
//     0
//  5     3
//     4
exports.getSubDisks = function(coords,radius) {
	return [coords,
		exports.destPoint(coords,radius,0),
		exports.destPoint(coords,radius,60),
		exports.destPoint(coords,radius,120),
		exports.destPoint(coords,radius,180),
		exports.destPoint(coords,radius,240),
		exports.destPoint(coords,radius,300)];
}
