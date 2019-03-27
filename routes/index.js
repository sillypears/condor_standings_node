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
        navTitle: "home",
        selectData: events['results']
       });
    }
  });
});

/* GET teamresults page */
router.get('/teamresults', function(req, res, next) {
  request({
    method: 'GET',
    uri: 'http://localhost:3000/api/teamresults',
  }, function (error, response, body){
    if(!error && response.statusCode == 200){
      let headers = ["Dark Cookies", "Frozen Cheese", "Italian Carrots", "Regular Ham", "Stinkin' Rebels", "Total"]
      let teams = {
        "Dark Cookies": {
          "Dark Cookies":    0,
          "Frozen Cheese":   0,
          "Italian Carrots": 0,
          "Regular Ham":     0,
          "Stinkin' Rebels": 0,
          "Total":           0,
        },
        "Frozen Cheese": {
          "Dark Cookies":    0,
          "Frozen Cheese":   0,
          "Italian Carrots": 0,
          "Regular Ham":     0,
          "Stinkin' Rebels": 0,
          "Total":           0,
        },
        "Italian Carrots": {
          "Dark Cookies":    0,
          "Frozen Cheese":   0,
          "Italian Carrots": 0,
          "Regular Ham":     0,
          "Stinkin' Rebels": 0,
          "Total":           0,
        },
        "Regular Ham": {
          "Dark Cookies":    0,
          "Frozen Cheese":   0,
          "Italian Carrots": 0,
          "Regular Ham":     0,
          "Stinkin' Rebels": 0,
          "Total":           0,
        },
        "Stinkin' Rebels": {
          "Dark Cookies":    0,
          "Frozen Cheese":   0,
          "Italian Carrots": 0,
          "Regular Ham":     0,
          "Stinkin' Rebels": 0,
          "Total":           0,
        }
      }

      let teamsAll = {
        "Dark Cookies": {
          "Dark Cookies":    0,
          "Frozen Cheese":   0,
          "Italian Carrots": 0,
          "Regular Ham":     0,
          "Stinkin' Rebels": 0,
          "Total":           0,
        },
        "Frozen Cheese": {
          "Dark Cookies":    0,
          "Frozen Cheese":   0,
          "Italian Carrots": 0,
          "Regular Ham":     0,
          "Stinkin' Rebels": 0,
          "Total":           0,
        },
        "Italian Carrots": {
          "Dark Cookies":    0,
          "Frozen Cheese":   0,
          "Italian Carrots": 0,
          "Regular Ham":     0,
          "Stinkin' Rebels": 0,
          "Total":           0,
        },
        "Regular Ham": {
          "Dark Cookies":    0,
          "Frozen Cheese":   0,
          "Italian Carrots": 0,
          "Regular Ham":     0,
          "Stinkin' Rebels": 0,
          "Total":           0,
        },
        "Stinkin' Rebels": {
          "Dark Cookies":    0,
          "Frozen Cheese":   0,
          "Italian Carrots": 0,
          "Regular Ham":     0,
          "Stinkin' Rebels": 0,
          "Total":           0,
        }
      }
      
      let json = JSON.parse(body)["results"];
      let wins = 0
      for (var i in json) {
        let wi = json[i]["winner"];
        let lo = 2;
        if (wi == 2) {
          lo = 1;
        }
        let tWin = "team" + wi;
        let tLos = "team" + lo;
        let tWinner = json[i][tWin];
        let tLoser = json[i][tLos];
        wins = teams[tWinner][tLoser];
        winsAll = teamsAll[tWinner][tLoser];
        console.log("w: " + tWinner + " l: "+ tLoser + " -- " + wins);
        if (tWinner != tLoser) {
          teams[tWinner]["Total"] = teams[tWinner]["Total"] + 1;
          teams[tWinner][tLoser] = wins + 1;
        }
        teamsAll[tWinner]["Total"] = teamsAll[tWinner]["Total"] + 1;
        teamsAll[tWinner][tLoser] = winsAll + 1;
      }
      res.render('teamresults', { 
        title: 'CoNDOR S7 Team Results',
        navTitle: "teamresults",
        tableResults: teams,
        tableResultsAll: teamsAll,
        tableHeaders: headers
       });
    }
  });
});
module.exports = router;
