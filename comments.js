//Create web server

var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var db = mongoose.connection;
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var url = 'mongodb://localhost:27017/Comments'; //Database name is Comments
var commentSchema = new Schema({
    comment: String,
    name: String,
    date: Date
});
var Comment = mongoose.model('Comment', commentSchema);
var port = 8080;
var comments = [];

//Connect to database
mongoose.connect(url, function(err) {
    if (err) {
        console.log("Error connecting to database");
    } else {
        console.log("Connected to database");
    }
});

//Use body parser to parse body of request
app.use(bodyParser.urlencoded({
    extended: true
}));

//Use body parser to parse json
app.use(bodyParser.json());

//Serve static files
app.use(express.static(path.join(__dirname, 'public')));

//Get request to get all comments
app.get('/getComments', function(req, res) {
    Comment.find(function(err, comments) {
        if (err) {
            res.send(err);
        } else {
            res.json(comments);
        }
    });
});

//Post request to add a comment
app.post('/addComment', function(req, res) {
    var comment = new Comment();
    comment.comment = req.body.comment;
    comment.name = req.body.name;
    comment.date = new Date();
    comment.save(function(err) {
        if (err) {
            res.send(err);
        } else {
            res.send("Comment added");
        }
    });
});

//Start listening on port
app.listen(port, function() {
    console.log('Server started on port ' + port);
});
