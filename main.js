

const   express = require('express'),
        router = express.Router();
        serv = express(),
        port = 8080;

const   closingnotes  = require('./Routes/closingNotes'),
        math          = require('./Routes/math');

serv.set('view engine', 'ejs');

serv.get("/", (req, res) => {

    res.render(__dirname + "/views/pages/home.ejs")

})

serv.get("/root", (req, res) => {

    res.send("rooted root");

})

serv.use("/closingnotes", closingnotes);

serv.use("/math", math);

serv.listen(port);
