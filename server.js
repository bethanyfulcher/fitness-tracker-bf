// DEPENDENCIES

const express = require("express");
const mongoose = require("mongoose");
// const compression = require("compression");
const logger = require("morgan")

// EXPRESS CONFIGURATION
const PORT = process.env.PORT || 8080;
const db = require('./models');
const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
// Sets up the Express app to handle data parsing
// app.use(compression());


mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/fitnesstracker", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
})

// ROUTER

app.get('/', (req,res) => {
    res.sendFile('./index.html')
})

// VIEW DATA
app.get('/api/exercises', (req,res) => {
    db.Exercise.find({}).then(dbExercises => {
        res.json(dbExercises);
    }).catch(err => {
        res.json(err)
    })
})

app.get('/api/weeks', (req,res) => {
    db.Week.find({}).then(dbWeek => {
        res.json(dbWeek);
    }).catch(err => {
        console.log(err)
        res.send(err)
    })
})

app.get('/populatedexercises', (req,res) => {
    db.Week.find({})
    .populate('exercises')
    .then(dbWeek => {
        res.json(dbWeek)
    }).catch(err => {
        console.log(err)
        res.send(err)
    })
})

app.post('/api/weeks', ({body}, res) => {
    db.Week.create(body)
    .then(dbWeek => {
        res.json(dbWeek)
    }).catch(err => {
        console.log(err)
        res.send(err)
    })
})

app.post('/api/exercises', (req, res) => {
    db.Exercise.create(req.body)
    .then(dbExercise => {
        db.Week.findOneAndUpdate({_id:req.body.weekId}, {$push: {exercises: dbExercise._id}})
        .then(dbWeek => res.send(dbWeek))
    }).catch(err => {
        console.log(err)
        res.send(err)
    })
})

// LISTENER

app.listen(PORT, function() {
    console.log("App listening on PORT: " + PORT)
})