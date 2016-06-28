var path = require('path');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');


var COMMENT_FILE = path.join(__dirname, 'comment.json');

app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(path.join(__dirname, '../public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/api/comments', function(req, res){
  fs.readFile(COMMENT_FILE, function(err, data){
    if (err) {
      console.error(err);
      process.exit(1); // 프로세스 종료시키는 명령어 0(default)은 정상종료, 1은 비정상 종료
      // 0, 1은 개발자 사이에서 약속일뿐 순수하게 프로그램을 종료시킨다는 의미는 아냐!!!!
    }
    res.json(JSON.parse(data));
    /*
      JSON.parse(<JSON String>); // string -> Json Object
      JSON.stringify(<JSON Object, JSON Array>, (<replacer: ex)functions..>), (<space number>) )
     */
  });
});

app.post('/api/comments', function(req, res){
  fs.readFile(COMMENT_FILE, function(err, data){
    if (err) {
      console.error(err);
      process.exit(1);
    }
    var comments = JSON.parse(data);

    var newComment = {
      id: Date.now(),
      author: req.body.author,
      text: req.body.text
    };

    comments.push(newComment);
    fs.writeFile(COMMENT_FILE, JSON.stringify(comments, null, 4), function(err){
      if(err){
        console.error(err);
        process.exit(1);
      }
      res.json(comments);
    });
  });
});

app.listen(app.get('port'), function(){
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});
