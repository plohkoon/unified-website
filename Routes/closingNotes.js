
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
//changing the view engine to render EJS


//A simple function to get todays date in the proper format
const getDate = () => {

    let     date = new Date(),
            day = ("0" + date.getDate()).slice(-2),
            month = ("0" + (date.getMonth() + 1)).slice(-2),
            year = date.getFullYear();

    return year + "-" + month + "-" + day;

}

const sqlEscape = (query) => {

    let     escapedQuery = query.replace("\'", "''"),
            cleansedQuery = sqlstring.escape(escapedQuery);

    cleansedQuery = cleansedQuery.replace(/\\/g, "");
    console.log(cleansedQuery);

    return cleansedQuery;

}

//opens a connection to the data base as read write
const db = new sqlite.Database(__dirname + "/../NOTES.db", sqlite.OPEN_READWRITE, (err) => {

    if(err) {

        console.log(err);
        throw err;

    }

    console.log("connection successful");

})
//a query that will ensure the database to be used exists
db.all("select name from sqlite_master where type = 'table' and name = 'notes'", [], (err, res) => {

    if(err) {

        console.log(err);
        throw err;

    }
    //if nothing is returned from the query "notes" does not exist
    if(res.length === 0) {
        //sets the query to create the table
        let sqlquery = "create table notes (id INTEGER PRIMARY KEY AUTOINCREMENT, note_id TEXT, note TEXT, date Text);";
        //executes the table creation
        db.all(sqlquery, [], (err, res) => {

            if(err) {

                console.log(err);
                throw err;

            }

            console.log("database created");

        })

    }

    console.log("Database exists");

});
//serves the local scripts, images and css
router.use(express.static(__dirname + "/../public"));

//main route anytime there is a date in the path
router.route('/[0-9]{4}-[0-9]{2}-[0-9]{2}')

    .get((req, res) => {
        //if there is something that is in the get request moves it to the path
        if(req.query.date !== undefined) {

            res.redirect('/closingnotes/' + req.query.date);

        }
        //else sets up the data to be rendered in main.ejs
        else {
            //extracts the date of the request from the path
            date = (req.path).slice(1,req.path.length);
            // where date = " + date + ";
            db.all("select id, note_id, note from notes where date = '" + date + "';", (err, rows) => {

                if(err) {

                    console.log(err);
                    throw err;

                }

                let data = {

                                date: date,

                                data: rows

                            }

                console.log(data);

                res.render(__dirname + '/../views/closingNotes.ejs', data);

            });

            console.log("rendered new Page");

        }

    })
    //post function for pushing new entries to server
    .post((req, res) => {
        //verifies the entries in log
        console.log(req.body.uniqueID);
        console.log(req.body.identifier);
        console.log(req.body.notes);
        console.log(req.body.changeType);
        //pulls all the data out to be used later
        let     uniqueid = req.body.uniqueID;
                date = (req.path).slice(1, req.path.length),
                changeType = req.body.changeType,
                id = req.body.identifier.toUpperCase(),
                notes = req.body.notes;
        //initializes the query variable to store what kind of query it will be
        let     sqlQuery;
        //sets the query to an insert
        if(changeType === "add") {

            sqlQuery = "insert into notes (date, note_id, note) values ('" + date + "', " + sqlEscape(id) + ", " + sqlEscape(notes) + ")";

            console.log("Built insert query");
            console.log(sqlQuery);

        }
        //sets the query to update the notes of one of the entries
        else if(changeType === "edit") {

            sqlQuery = "update notes set note = " + sqlEscape(notes) + " where date = '" + date + "' and id = " + sqlEscape(uniqueid);

            console.log("Built update query");
            console.log(sqlQuery);

        }
        //sets the query to delete the specified entry
        else if(changeType === "delete") {

            sqlQuery = "delete from notes where date = '" + date + "' and id = " + sqlEscape(uniqueid);

            console.log("Built delete query");
            console.log(sqlQuery);

        }
        /*
        fall through if by some stroke of witchery they manage to not make
        it into one of the proper if streams
        */
        else {

            console.log("Got a bad post request, skipping query and rerendering page");
            res.redirect(req.path);

        }
        //runs the query defined earlier
        db.run(sqlQuery, [], (err, res) => {

            if(err) {

                console.log(err);
                throw err;

            }

            console.log("query completed");

        });

        console.log("Query performed rerendering page");

        res.redirect("/closingnotes" + req.path);

    })

/*
this will be the default connection when people first connect to server
gets todays date in the correct format and redirects to the respective page
*/
router.get('/', (req, res) => {
    //fall back for when the root is empty
    console.log("Got root request rendering" + '/' + getDate())

    res.redirect("/closingnotes/"+ getDate());

})
//anytime a different path is put in just redirects to todays date
router.all("/*", (req, res) => {

    console.log("Got a bad request defaulting to todays date, rendering todays date");

    res.redirect("/closingnotes/" + getDate());

})
//ensures the server listen is referenced so the port can be closed on app close
module.exports = router;
