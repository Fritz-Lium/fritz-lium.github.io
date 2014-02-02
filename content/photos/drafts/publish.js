/**
 * Created by fritz on 1/29/14.
 */
var fs = require('fs-extra');
var path = require('path');
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
var suffix = path.extname(file);
var title = file.replace(new RegExp(suffix + '$'), '');
var sTitle = toSnakeCase(title);
var source = __dirname + '/' + file;
var dest = tardir + '/' + dirname + '/' + sTitle + suffix;
fs.mkdirpSync(path.dirname(dest));
fs.renameSync(source, dest);

// meta[files]
var files = meta['files'];
var oFile = {};
oFile['title'] = toSnakeCase(file).replace(new RegExp(suffix + '$'), '');
oFile['date'] = datetime;
if (tags.length > 0) {
	oFile['tags'] = tags.map(function (val) {
		return toSnakeCase(val);
	});
}
if (!files[dirname]) {
	files[dirname] = {};
	files[dirname]['.'] = [];
}
files[dirname]['.'].push(oFile);
fs.writeFileSync(metaFile, JSON.stringify(meta, null, '\t'));

function toDatetime(date) {
	date = new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
	var j = date.toJSON();
	return j.slice(0, 10) + ' ' + j.slice(11, 19);
}
function toSnakeCase(str) {
	return str.toLowerCase().replace(/ /g, '-');
}
