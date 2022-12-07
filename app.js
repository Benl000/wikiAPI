// jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

mongoose.set('strictQuery', false);

mongoose.connect("mongodb://127.0.0.1:27017/wikiDB", { useNewUrlParser: true });

const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Article = mongoose.model('Article', articleSchema);

///////////// All articles ////////

app.route('/articles')

    .get((req, res) => {
        Article.find((err, allArticales) => {
            if (!err) {
                res.send(allArticales);
            } else {
                res.send('error is:', err);
            }
        });
    })

    .post((req, res) => {

        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });

        newArticle.save((err) => {
            if (!err) {
                res.send('Successfully added new article');
            } else {
                res.send(err);
            }
        });

    })

    .delete((req, res) => {

        Article.deleteMany((err) => {
            if (!err) {
                res.send('Successfully deleted all articles');
            } else {
                res.send(err);
            }
        });

    });

///////////// Single article ////////

app.route('/articles/:articleTitle')

    .get((req, res) => {

        Article.findOne({ title: req.params.articleTitle }, (err, foundArticale) => {
            if (foundArticale) {
                res.send(foundArticale);
            } else {
                res.send('no articles found');
            }
        });

    })

    .put((req, res) => {
        Article.updateOne(
            { title: req.params.articleTitle },
            { title: req.body.title, content: req.body.content },
            (err) => {
                if (!err) {
                    res.send('Successfully updated article');
                } else {
                    res.send(err);
                }
            }
        );
    })

    .patch((req, res) => {
        Article.updateOne(
            { title: req.params.articleTitle },
            { $set: req.body },
            (err) => {
                if (!err) {
                    res.send('Successfully updated article');
                } else {
                    res.send(err);
                }
            }
        );
    })

    .delete((req, res) => {
        Article.deleteOne(
            { title: req.params.articleTitle },
            (err) => {
                if (!err) {
                    res.send('Successfully deleted the article');
                } else {
                    res.send(err);
                }
            }
        );
    });

///////////////////////////////////////


app.listen(3000, () =>
    console.log(' server listening on port 3000'));