// Create web server and listen on port 3000
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var mongoose = require('mongoose');
var Comment = require('./comment.js');

// Connect to the database
mongoose.connect('mongodb://localhost/comment');

// Parse the body of the request
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Get all comments
app.get('/api/comments', function(req, res) {
  Comment.find(function(err, comments) {
    if (err) {
      res.send(err);
    } else {
      res.json(comments);
    }
  });
});

// Create a new comment
app.post('/api/comments', function(req, res) {
  var comment = new Comment();
  comment.author = req.body.author;
  comment.text = req.body.text;

  comment.save(function(err) {
    if (err) {
      res.send(err);
    } else {
      res.json({ message: 'Comment added' });
    }
  });
});

// Delete a comment
app.delete('/api/comments/:comment_id', function(req, res) {
  Comment.remove({
    _id: req.params.comment_id
  }, function(err, comment) {
    if (err) {
      res.send(err);
    } else {
      res.json({ message: 'Comment deleted' });
    }
  });
});

// Update a comment
app.put('/api/comments/:comment_id', function(req, res) {
  Comment.findById(req.params.comment_id, function(err, comment) {
    if (err) {
      res.send(err);
    } else {
      comment.author = req.body.author;
      comment.text = req.body.text;

      comment.save(function(err) {
        if (err) {
          res.send(err);
        } else {
          res.json({ message: 'Comment updated' });
        }
      });
    }
  });
});

// Start the server
app.listen(3000, function() {
  console.log('Server running at http://localhost:3000');
});