if (process.env.NODE_ENV === "production") {
    module.exports = { mongoURI: "mongodb+srv://Hasitha:Freedom6@cluster0-sba0o.mongodb.net/test?retryWrites=true&w=majority" };
} else {
    module.exports = { mongoURI: "mongodb://localhost/project-ideas" };
}