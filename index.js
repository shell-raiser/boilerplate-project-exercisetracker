const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
var bodyParser = require('body-parser')
var mongoose = require('mongoose');
const mySecret = process.env['MONGO_URI']
console.log(mySecret);
mongoose.connect(mySecret, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.urlencoded({ extended: false }))


let excerciseSchema = new mongoose.Schema({
    username: String,
    description: String,
    duration: Number,
    date: Date,
}
)

let doc = mongoose.model('doc', excerciseSchema);
app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html')
});

let allUsers = [];
app.get('/api/users', function(req, res) {
    res.send(allUsers)


})


app.post('/api/users', function(req, res) {
    let user = new doc({
        username: req.body.username,
    })
    user.save((err, data) => {
        if (err) return console.error(err);
        allUsers.push({
            username: data.username,
            _id: data.id
        })
        res.json({
            username: data.username,
            _id: data.id
        });
    });

});

app.post('/api/users/:_id/exercises', function(req, res) {
    doc.findOneAndUpdate({ _id: req.params._id },
        {
            description: req.body.description,
            date: req.body.date,
            duration: req.body.duration
        }, { new: true }, (err, data) => {
            if (err) return console.log(err);
            res.json({
                _id: data._id,
                username: data.username,
                date: data.date.toDateString(),
                duration: data.duration,
                description: data.description
            })
        });
});


app.get('/api/users/:_id/logs', function(req,res){
    
})

const listener = app.listen(process.env.PORT || 3000, () => {
    console.log('Your app is listening on port ' + listener.address().port)
})
