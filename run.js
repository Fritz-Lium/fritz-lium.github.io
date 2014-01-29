/**
 * Created by fritz on 1/29/14.
 */
var express = require('express');
var app = express();

app.use(express.static(__dirname));
app.listen(8011);
