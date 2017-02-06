// This is the site I got all my formulas from
// http://www.movable-type.co.uk/scripts/latlong.html
// Angles should be in radians
var R  = 6371000; // Earth's radius in meters
var pi = 4.0*Math.atan(1.0); // Pi radius

function toRad(ang) {
	return ang*(pi/180.0);
};

function toDeg(ang) {
	return ang*(180.0/pi);
};

// Coords in degrees, bearing in degrees too (measured from North)
exports.destPoint = function(coords,d,bearing) {
	var phi1 = toRad(coords.lat);
	var lam1 = toRad(coords.lon);
	var brng = toRad(bearing);
	var phi2 = Math.asin(Math.sin(phi1)*Math.cos(d/R) + Math.cos(phi1)*Math.sin(d/R)*Math.cos(brng));
	var lam2 = lam1 + Math.atan2(Math.sin(brng)*Math.sin(d/R)*Math.cos(phi1),Math.cos(d/R)-Math.sin(phi1)*Math.sin(phi2));
	return {lat:toDeg(phi2),lon:toDeg(lam2)}
}
