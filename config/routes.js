// server routes


// bring in scrape function from our scripts directory
var scrape = require("../scripts/scrape");

// bring headlines and notes from controller
var headlinesController = require("../controllers/headlines");
var notesController = require("../controllers/notes");

module.exports = function(router) {
    // this route gets the homepage
    router.get("/", function(req, res){
        res.render("home");
    });
    // this route gets the saved page
    router.get("/saved", function(req, res){
        res.render("saved");
    });

    router.get("/api/fetch", function(req, res){
        headlinesController.fetch(function(err, docs){
            if (!docs || docs.insertedCount === 0) {
                res.json({
                    message: "No new articles for today, check back tomrrow!"
                });
            }
            else {
                res.json({
                    message: "Added " + docs.insertedCount + " new articles!"
                });
            }
        });
    });
    router.get("api/headlines", function(req, res){
        var query = {};
        if (req.query.saved) {
            query = req.query;
        }

        headlinesController.get(query, function(data){
            res.json(data);
        });
    });

    router.delete("/api/headlines/:id", function(req, res){
        var query = {};
        query._id = req.params.id;
        headlinesController.delete(query, function(err, data){
            res.json(data);
        });
    });

    router.patch("/api/headlines", function(req, res){
        headlinesController.update(req.body, function(err, data){
            res.json(data);
        });
    });
    router.get("/api/notes/:headline_id?", function(req, res){
        var query = {};
        if (req.params.headline_id){
            query._id = req.params.headline_id;
        }

        notesController.get(query, function(err, data){
            res.json(data);
        });
    });

    router.delete("/api/notes/:id", function(Res, res){
        var query = {};
        query._id = req.params.id;
        notesController.delete(query, function(err, data){
            res.json(data);
        });
    });
    router.post("/api/notes", function(req, res){
        notesController.save(req.body, function(data){
            res.json(data);
        });
    });
}