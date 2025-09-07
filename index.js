const http = require('http');
const path = require('path');
const fs = require('fs');

const server = http.createServer((req, res) => {
  // Set file path
  // If req.url is /, then set path to index.html; otherwise, set it to req.url.
  let filePath = path.join(__dirname, 'public', req.url == '/' ? 'index.html' : req.url);

  // Get file extension
  let extName = path.extname(filePath);

  // Set initial content type
  let contentType = 'text/html';

  // Check file extension and set content type
  switch(extName) {
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.css':
      contentType = 'text/css';
      break;
    case '.json':
      contentType = 'application/json';
      break;
    case '.png':
      contentType = 'image/png';
      break;
    case '.jpg':
      contentType = 'image/jpg';
      break;    
  }

  // Read file path
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code == 'ENOENT') {
        // ENOENT (No such file or directory) -> https://nodejs.org/api/errors.html#common-system-errors
        // Serve 404.html.
        fs.readFile(path.join(__dirname, 'public', '404.html'), (err, content) => {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(content, 'utf-8');
        });
      } else {
        // For server error
        res.writeHead(500);
        res.end(`Server error: ${err.code}`);
      }
    } else {
      // 200 OK
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8'); // https://nodejs.org/api/http.html#responseenddata-encoding-callback
    }
  });
});

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));