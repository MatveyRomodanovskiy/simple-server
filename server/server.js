//==============BASIC HTTP SERVER==============
const http = require('http');
const fs = require('fs');
const path = require('path');
const PORT = 3000;
const FILENAME = path.join(__dirname, '../services/fields.json');
//GET Handler - returns file content as JSON
function handleGet(req, res) {
    fs.readFile(FILENAME, 'utf-8', (err, data) => {
        if (err){
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end("Error reading file");
        } else {
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(data);
        }
    })
}

//POST Handler - saves file content
function handlePostSave(req, res) {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on ('end', () => {
        try {
            const data = JSON.parse(body);
            fs.writeFile(FILENAME, JSON.stringify(data, null, 2), 'utf-8', (err) => {
                if (err) {
                    res.writeHead(500, {'Content-Type': 'text/plain'});
                    res.end("Error writing file");
                } else {
                    res.writeHead(200, {'Content-Type': 'text/plain'});
                    res.end("File saved");
                }
            })
        }catch {
            res.writeHead(400, {'Content-Type': 'text/plain'});
            res.end ("Invalid JSON");
        }
    })
}
const routes = {
    'GET /': handleGet,
    'POST /save': handlePostSave
};

const server = http.createServer((req, res) => {
    const routeKey = `${req.method} ${req.url}`;
    const handler = routes[routeKey];
    handler ? handler(req, res) : res.writeHead(404, {'Content-Type': 'text/plain'}).end('Not found');
})

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})