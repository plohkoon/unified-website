
//import of external packages to be used
const   url = require('url'),
        http = require('http'),
        path = require('path'),
        bodyParser = require('body-parser'),
        ejs = require('ejs');

//initiating server info
const   express = require('express'),
        router = express.Router();

router.use(express.static(__dirname + '/../public'))

router.get('/:puzzle', (req, res) =>{
  res.render(__dirname + "/../views/pages/mathApp.ejs");
});

router.get('/', (req, res) => {
  res.redirect('/math/1');
});

module.exports = router;
