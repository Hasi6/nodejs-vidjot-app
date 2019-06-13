const express = require("express");
const handlebars = require("express-handlebars");

const app = express();

//handlebars middleware
app.engine('handlebars', handlebars({
    defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');


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

const port = 5500;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});