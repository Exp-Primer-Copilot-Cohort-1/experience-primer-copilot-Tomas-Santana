// create web server
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');
var multer = require('multer');

app.use(bodyParser.urlencoded({extended: false}));
app.locals.pretty = true;
app.set('views', './views_file');
app.set('view engine', 'jade');
app.use('/user', express.static('uploads'));

var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, 'uploads/'); // 파일이 저장되는 경로
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname + Date.now()); // 파일의 이름이 저장되는 경로
  }
});

var upload = multer({storage: storage}).single('userfile');

app.get('/upload', function (req, res) {
  res.render('upload');
});

app.post('/upload', function (req, res) {
  upload(req, res, function (err) {
    if (err) {
      console.log(err);
      return;
    }
    console.log(req.file);
    res.send('Upload : ' + req.file.originalname);
  });
});

app.get('/topic/new', function (req, res) {
  fs.readdir('data', function (err, files) {
    if (err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
    res.render('new', {topics: files});
  });
});

app.get(['/topic', '/topic/:id'], function (req, res) {
  var id = req.params.id;

  fs.readdir('data', function (err, files) {
    if (err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
    }

    if (id) {
      fs.readFile('data/' + id, 'utf8', function (err, data) {
        if (err) {
          console.log(err);
          res.status(500).send('Internal Server Error');
        }
        res.render('view', {topics: files, title: id, description: data});
      });
    } else {
      res.render('view', {topics: files, title: 'Welcome', description: 'Hello, JavaScript for server.'});
    }
  });
});

