'use strict';

var
express = require("express"),
app = express(),
handler = require('./handler.js'),
port = process.env.PORT || 8080,
mongo = require('mongodb').MongoClient;

mongo.connect('mongodb://localhost:27017/learnyoumongo', function (err, db) {
  if (err) throw err;
  var searchHandler = new handler();

  app.get('/api/imagesearch/:test', function (req, res) {
    searchHandler.queryByArgs(req, res, db, req.params.test);
  });

  app.get('/api/latest/imagesearch/', function (req, res) {
    searchHandler.latest(req, res, db);
  });

  app.listen(port, function () {
    console.log('Listening on port ' + port + '...');
  });
});
