// require dependencies
var express = require("express");
var mongoose = require("mongoose");
var expressHandlebars = require("express-handlebars");
var bodyParser = require("body-parser");

// set up port
var PORT = process.env.PORT || 3000;

// express
var app = express();

// set up express route
var router = express.Router();

// require routes fules to pass through route object
require("./config/routes")(router);

// make our public folder out static directory
app.use(express.static(__dirname + "/public"));

// connect handlebars to express app
app.engine("handlebars", expressHandlebars({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");

// use bodyParser in our app
app.use(bodyParser.urlencoded({
    extended: false
}));

// have every request go through router
app.use(router);

// if deployed, use the deployed database
var db = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// connect mongoose to our database
mongoose.connect(db, {
    useNewUrlParser: true
}, 
    function(error){
    if(error){
        console.log("A for effort, but no connection to mongoose.");
    }

    else {
       console.log ("Yay! The mongoose connection is successful!")
    }
});

// showing connection works
app.listen(PORT, function(){
    console.log("Listening on port: " + PORT);
});