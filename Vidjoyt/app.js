const express = require("express");
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");


const app = express();

//Map globla promise - get rid of warning
mongoose.Promise = global.Promise;

//connect to mongoose
mongoose.connect("mongodb://localhost/project-ideas", { useNewUrlParser: true })
    .then(() => { //promises is connected show this
        console.log("Mongodb Connected");
    })
    .catch((err => { //is there is an error show the error
        console.log(`Error Found ${err}`);
    }));

//Load Idea Models
require("./models/Idea");
const Idea = mongoose.model('Idea')

//handlebars middleware
app.engine('handlebars', handlebars({
    defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');

// body parser middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



// index Route
app.get("/", (req, res) => {
    const title = "Welcome Home";
    res.render("Index", {
        title: title
    });
});

// about Route
app.get("/about", (req, res) => {
    const title = "Welcome About"
    res.render("About", {
        title: title
    });
});

//idea index page
app.get("/ideas", (req, res) => {
    Idea.find({})
        .sort({ date: 'desc' })
        .then(ideas => {
            res.render('ideas/index', {
                ideas: ideas
            });
        });
});

// add ideas form
app.get("/ideas/add", (req, res) => {
    res.render("ideas/ideasAdd");
});

// process Form
app.post("/idea", (req, res) => {
    let errors = [];
    if (!req.body.title) {
        errors.push({ text: "plese add a title" });
    }
    if (!req.body.details) {
        errors.push({ text: "please add a description" });
    }
    if (errors.length > 0) {
        res.render("ideas/ideasAdd", {
            errors: errors,
            title: req.body.title,
            details: req.body.title
        });
    } else {
        const newIdea = {
            title: req.body.title,
            details: req.body.details
        }
        new Idea(newIdea)
            .save()
            .then(idea => {
                res.redirect("/ideas");
            });
    }
});

const port = 5500;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});