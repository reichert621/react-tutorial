
var mongoose = require('mongoose');
var route = require('koa-route');
var serve = require('koa-static');
var parse = require('co-body');
var koa = require('koa');
var app = koa();

var commentSchema = new mongoose.Schema({
  author: String,
  text:   String
});

var Comment = mongoose.model('Comment', commentSchema);

mongoose.connect('mongodb://localhost/react-test');

app.use(serve(__dirname + '/public'));
app.use(route.get('/comments.json', index));
app.use(route.post('/comments.json', create));

function *index() {
  var comments = yield Comment.find().exec();

  this.body = comments;
}

function *create() {
  var params = yield parse(this);
  var comment = new Comment(params);

  comment.save();

  this.redirect('/comments.json');
}

app.listen(3000);