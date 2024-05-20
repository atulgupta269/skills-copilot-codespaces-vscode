//create a web server
var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var path = require('path');

http.createServer(function (req, res) {
  var method = req.method;
  var uri = url.parse(req.url, true);
  var pathname = uri.pathname;
  var filename = path.join(process.cwd(), pathname);
  var extname = path.extname(filename);
  var contentType = 'text/html';
  var postData = '';

  if (method === 'POST') {
    req.on('data', function (data) {
      postData += data;
    });
    req.on('end', function () {
      postData = qs.parse(postData);
      fs.appendFile('comments.txt', postData.comment + '\n', function (err) {
        if (err) {
          console.log(err);
        }
      });
    });
  }

  if (extname === '.css') {
    contentType = 'text/css';
  }

  fs.readFile(filename, 'utf8', function (err, data) {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.write('404 Not Found\n');
      res.end();
      return;
    }

    res.writeHead(200, { 'Content-Type': contentType });
    res.write(data);
    res.end();
  });
}).listen(8124);
console.log('Server running at http://');
