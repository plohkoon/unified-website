

const   express = require('express'),
        router = express.Router();
        serv = express(),
        port = 80;

const   closingnotes  = require('./Routes/closingNotes'),
        math          = require('./Routes/math'),
        chess         = require('./Routes/chess');

serv.set('view engine', 'ejs');

serv.use(express.static(__dirname + '/public'))

serv.get("/", (req, res) => {

    res.render(__dirname + "/views/pages/home.ejs")

})

serv.get("/root", (req, res) => {

    res.send("rooted root");

})

serv.use("/closingnotes", closingnotes);

serv.use("/math", math);

serv.use("/chess", chess);

serv.listen(port);
