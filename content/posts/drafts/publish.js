/**
 * Created by fritz on 1/29/14.
 */
var fs = require('fs');
var path = require('path');
var beautify = require('js-beautify');
var file = process.argv[2];
var tags = process.argv.slice(3);

var tardir = path.resolve(__dirname, '..');
var metaFile = tardir + '/meta.json';
var meta = require(metaFile);

// dirname
var date = new Date();
var datetime = toDatetime(date);
var dirname = datetime.slice(0, 7);

// move file
var source = __dirname + '/' + file;
var dest = tardir + '/' + dirname + '/' + file;
fs.renameSync(source, dest);

// meta[files]
var suffix = meta['suffix'] || '';
var files = meta['files'];
var oFile = {};
oFile['title'] = toSnakeCase(file).replace(new RegExp(suffix + '$'), '');
if (tags.length > 0) {
	var sTags = tags.map(function (val) {
		return toSnakeCase(val);
	});
	oFile['date'] = datetime;
	oFile['tags'] = sTags;
}
if (!files[dirname]) {
	files[dirname] = {};
	files[dirname]['.'] = [];
}
files[dirname]['.'].push(oFile);
fs.writeFileSync(metaFile, beautify(JSON.stringify(meta)));

function toDatetime(date) {
	date = new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
	var j = date.toJSON();
	return j.slice(0, 10) + ' ' + j.slice(11, 19);
}
function toSnakeCase(str) {
	return str.toLowerCase().replace(/ /g, '-');
}
