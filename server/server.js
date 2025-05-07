const http = require('http');
const fs = require('fs');
const path = require('path');
const { restoreNestedObjectFromFile } = require('../services/restoreNestedObject.js');

const PORT = 3000;
const FILENAME = path.join(__dirname, '../services/fields.json');

function handleGet(req, res) {
    fs.readFile(FILENAME, 'utf-8', (err, data) => {
        if (err) return res.writeHead(500).end('Error reading file');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(data);
    });
}

function handlePost(req, res) {
    let body = '';
    req.on('data', chunk => (body += chunk));
    req.on('end', () => {
        try {
            const data = JSON.parse(body);
            fs.writeFile(FILENAME, JSON.stringify(data, null, 2), 'utf-8', err => {
                if (err) return res.writeHead(500).end('Error saving file');
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end('Saved');
            });
        } catch {
            res.writeHead(400).end('Invalid JSON');
        }
    });
}

function handleRestore(req, res) {
    try {
        const restored = restoreNestedObjectFromFile(FILENAME);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(restored, null, 2));
    } catch {
        res.writeHead(500).end('Error restoring object');
    }
}

const routes = {
    'GET /': handleGet,
    'POST /save': handlePost,
    'GET /restore': handleRestore,
};

const server = http.createServer((req, res) => {
    const key = `${req.method} ${req.url}`;
    const handler = routes[key];
    handler ? handler(req, res) : res.writeHead(404).end('Not found');
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
