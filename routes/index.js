var express = require('express');
var request = require('request');

var router = express.Router();
const conn = ('../db.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  
  
  request({
    method: 'GET',
    uri: 'http://localhost:3000/api/event',
  }, function (error, response, body){
    if(!error && response.statusCode == 200){
      let events = JSON.parse(body);
      res.render('index', { 
        title: 'CoNDOR Standings',
        selectData: events['events']
       });
    }
  });


});

module.exports = router;
