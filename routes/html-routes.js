var path = require("path")
var express = require("express");
var router = express.Router();
var db = require("../models");
var request = require("request");
var cheerio = require("cheerio");

router.get("/", function (req, res) {
    res.render("index");
})
// Routes

// A GET route for scraping the echojs website
router.get("/scrape", function (req, res) {
    var results = {};

    // First, we grab the body of the html with request
    request("https://www.reddit.com/r/funny/", function (error, response, html) {
        var $ = cheerio.load(html);
        $(".thing").each(function (i, element) {
            
            var title = $(element).find(".title").children("a").text();
            var link = $(element).find(".title").children("a").attr("href");
            var thumbnail = $(element).find(".thumbnail").children("img").attr("src");
            results.title = title;
            if (link.includes("/r/funny")) {
                link = "https://www.reddit.com" + link
            };
            results.link = link;
            thumbnail = "https:" + thumbnail;
            results.thumbnail = thumbnail;
            console.log(results)
            var funny = new db.Funny(results)
            funny.save(function (err, funny) {
                if (err) return console.error(err);
            });
        });
    });

    // If we were able to successfully scrape and save an Funny, send a message to the client
    res.render("index", results);
});


// Route for getting all Funnys from the db
router.get("/funnies", function (req, res) {
    // Grab every document in the Funnys collection
    db.Funny.find({})
        .then(function (dbFunny) {
            // If we were able to successfully find Funnys, send them back to the client
            res.json(dbFunny);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

// Route for grabbing a specific Funny by id, populate it with it's note
router.get("/funnies/:id", function (req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Funny.findOne({ _id: req.params.id })
        // ..and populate all of the notes associated with it
        .populate("note")
        .then(function (dbFunny) {
            // If we were able to successfully find an Funny with the given id, send it back to the client
            res.json(dbFunny);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

// Route for saving/updating an Funny's associated Note
router.post("/funnies/:id", function (req, res) {
    // Create a new note and pass the req.body to the entry
    db.Note.create(req.body)
        .then(function (dbNote) {
            // If a Note was created successfully, find one Funny with an `_id` equal to `req.params.id`. Update the Funny to be associated with the new Note
            // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
            // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
            return db.Funny.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
        })
        .then(function (dbFunny) {
            // If we were able to successfully update an Funny, send it back to the client
            res.json(dbFunny);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

// Route for deleting an Funny's associated Note
router.delete("/funniesdelete/:id", function (req, res) {
    // Create a new note and pass the req.body to the entry
    db.Note.deleteOne(req.body)
        .then(function (dbNote) {
            // If a Note was deleted successfully, find one Funny with an `_id` equal to `req.params.id`. Update the Funny to be associated with the new Note
            // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
            // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
            return db.Funny.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
        })
        .then(function (dbFunny) {
            // If we were able to successfully update an Funny, send it back to the client
            res.json(dbFunny);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});
module.exports = router;