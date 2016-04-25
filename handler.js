'use strict';
/*
 * Custom google search
 * CX key  obtained by google
 * Then the API key obtained with googleapi's
 * Then image-search enabled in the console https://cse.google.com/cse/setup/basic?cx=*********
 */
module.exports = function handler() {
  var _self = this;

  _self.queryByArgs = function (req, res, db, args) {
    var
    CX = process.env.CX || '***********',
    key = process.env.API_KEY || '***********',
    newdoc = {
      term : args,
      when : new Date(),
    },
    offset,
    queryURL;

    if (req.query)
      offset = req.query.offset;
    if (db !== null) {
      db.collection('images').insert(newdoc, function (err, data) {
        if (err)
          throw err;
      });
    }
    if (offset === undefined) {
      queryURL = 'https://www.googleapis.com/customsearch/v1?q=' + args + '&cx=' + CX + '&safe=medium&searchType=image&key=' + key;
    } else {
      queryURL = 'https://www.googleapis.com/customsearch/v1?q=' + args + '&cx=' + CX + '&safe=medium&searchType=image&start=' + offset + '&key=' + key;
    }
    require('request')(queryURL, function (error, response, body) {
      if (error)
        throw error;

      var
      resultsToJSON,
      resultsToReturn = [];

      if (response.statusCode == 200) {
        resultsToJSON = JSON.parse(body).items;
        if (resultsToJSON) {
          resultsToJSON.forEach(function (result) {
            resultsToReturn.push({
              url : result.link,
              snippet : result.snippet,
              thumbnail : result.image.thumbnailLink,
              context : result.image.contextLink
            });
          });
          res.json(resultsToReturn);

        } else {
          res.send("No data found");
        }

      } else
        res.send(response.statusCode);
    });
  };

  _self.latest = function (req, res, db) {
    db.collection('images').find({}, {
      term : 1,
      when : 1,
      _id : 0
    }).sort({
      _id : -1
    }).limit(10).toArray(function (err, doc) {
      if (err) {
        res.send(err);
      } else {
        res.send(doc)
      }
    });
  };
};
