//you have to look up how to run a js file and interact with it 
//on the html page, we use node.js to run the js file 

const fetch = require('node-fetch');
const fs = require('fs');
const http = require('http');
const path = require('path');
const port = 3000;

http.createServer(function (req, res) {
  if (req.url === '/') {
    // Send the HTML page
    res.writeHead(200, { 'Content-Type': 'text/html' });
    const html = fs.readFileSync(path.join(__dirname, 'frontEnd.html'));
    res.end(html);
  } else if (req.url === '/getRandomImage') {
    // Fetch a random image from an API
    fetch('https://source.unsplash.com/random')
      .then((response) => {
        if (response.status === 200) {
          return response.url;
        } else {
          throw new Error('Failed to fetch image');
        }
      })
      .then((imageUrl) => {
        // Send the image URL as a JSON response
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ imageUrl }));
      })
      .catch((error) => {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error: ' + error.message);
      });
  }
}).listen(port);

console.log(`Server is running on http://localhost:${port}`);
