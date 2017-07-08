const http = require('http');
const https = require('https');
const url = require('url');
const dotenv = require('dotenv').load();

const PORT = 9000;
const headers = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }

function reqWeather(req, res) {
  console.log('Requesting Weather info');
  if (req.method !== 'GET') {
    res.writeHead(400, headers);
    res.write(JSON.stringify({
      message: `Method ${req.method} not supported`
    }, true, 2));
    res.end();
  }

  const { query } = url.parse(req.url, true);
  const apiBaseUrl = 'https://api.darksky.net/forecast';
  const ep = `${apiBaseUrl}/${process.env.DARKSKY_SECRET}/${query.lat},${query.lon}`

  https.get(ep, (wres) => {
    const { statusCode } = wres;
    const contentType = wres.headers['content-type'];

    let error;
    if (statusCode !== 200) {
      wres.writeHead(statusCode, headers);
      wres.write(JSON.stringify({
        message: `Error retrieving weather data`,
      }, true, 2));
      wres.end();
    }

    wres.setEncoding('utf8');
    let rawData = '';
    wres.on('data', (chunk) => {
      rawData += chunk;
    });
    wres.on('end', () => {
      try {
        const parsedData = JSON.parse(rawData);
        res.writeHead(200, headers);
        res.write(JSON.stringify(parsedData, true, 2));
        res.end();
      } catch (e) {
        wres.writeHead(statusCode, headers);
        wres.write(JSON.stringify({
          message: `Error retrieving weather data`,
        }, true, 2));
        wres.end();
      }
    });
  }).on('error', (e) => {
      res.writeHead(500, headers);
      res.write(JSON.stringify({
        message: `Error retrieving weather data`,
      }, true, 2));
      res.end();
  });
}

http.createServer(function (req, res) {
  const { pathname } = url.parse(req.url, true);
  console.log(`[API]: ${req.url}`);
  switch (pathname) {
    case '/weather':
      return reqWeather(req, res);
    default:
      res.writeHead(200, headers);
      res.write(JSON.stringify({status: 'OK'}, true, 2));
      return res.end();
  }
}).listen(PORT);

console.log(`Listening on PORT: ${PORT}`);