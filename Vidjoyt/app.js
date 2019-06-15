const express = require("express");
const path = require("path");
const handlebars = require("express-handlebars");
const methodOverride = require('method-override');
const flash = require("connect-flash");
const session = require("express-session");
const bodyParser = require("body-parser");
const passport = require("passport");
const mongoose = require("mongoose");


const app = express();

//Load routes
const ideas = require("./routes/ideas");
const users = require("./routes/user");

//Map global promise - get rid of warning
mongoose.Promise = global.Promise;

//connect to mongoose
mongoose.connect("mongodb://localhost/project-ideas", { useNewUrlParser: true })
    .then(() => { //promises is connected show this
        console.log("Mongodb Connected");
    })
    .catch((err => { //is there is an error show the error
        console.log(`Error Found ${err}`);
    }));



//handlebars middleware
app.engine('handlebars', handlebars({
    defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');

// body parser middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// static folder
app.use(express.static(path.join(__dirname, 'public')));

// Method override middleware
app.use(methodOverride('_method'));

// Express session meddileware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

// flash middleware
app.use(flash());

// Global variables for messages
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.user = req.user || null;

    res.locals.error = req.flash("error");
    next();
});

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


// user routes
app.use("/users", users);

//Use routes
app.use("/ideas", ideas);

// passport config
require("./config/passport")(passport);

const port = 5500;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});