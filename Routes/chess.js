//import of external packages to be used
const   url = require('url'),
        http = require('http'),
        path = require('path'),
        bodyParser = require('body-parser'),
        ejs = require('ejs'),
        sqlstring = require('sqlstring'),
        sqlite = require('sqlite3').verbose();
//initiating server info
const   express = require('express'),
        router = express.Router();
//setting up the POST request parser
router.use(bodyParser.urlencoded(({extended:false})));
router.use(bodyParser.json());

router.use(express.static(path.resolve(__dirname + '/../public/chess')));

router.route('/')
  .get((req, res) => {
    console.log('loading chess game');
    res.render(__dirname + '/../views/pages/chess.ejs');
  })

module.exports = router;
