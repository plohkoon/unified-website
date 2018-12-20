

const   express = require('express'),
        router = express.Router();
        serv = express(),
        port = 8080;

const   test = require('./test'),
        closingnotes = require('./Routes/closingNotes');

serv.set('view engine', 'ejs');

serv.get("/", (req, res) => {

    res.send("root");

})

serv.get("/root", (req, res) => {

    res.send("rooted root");

})

serv.use("/test", test);

serv.use("/closingnotes", closingnotes);

serv.listen(port);
