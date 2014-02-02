/**
 * Created by fritz on 1/29/14.
 */
var express = require('express');
var port = process.argv[2] || 8011;
var app = express();

app.use(express.static(__dirname));
app.listen(port, function () {
	console.log('\nListening on port %d.\n', port);
});
