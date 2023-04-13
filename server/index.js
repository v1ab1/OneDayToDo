const PORT = 4000;

const { existsSync, readFileSync, writeFileSync } = require('fs');
const { parse } = require('url');
const createServer = require('http').createServer;

const dbPath = './db.json';

const readDb = () => {
  const data = existsSync(dbPath) ? readFileSync(dbPath) : '[]';
  return JSON.parse(data);
}

const writeDb = (data) => {
  writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

createServer(async (req, res) => {
  const { method, url } = req;
  const { pathname, query } = parse(url, true);

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (method === 'OPTIONS') {
    res.end();
    return;
  }

  if (method === 'GET' && pathname === '/') {
    const data = readDb();
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));
    return;
  }

  if (method === 'POST' && pathname === '/') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const data = readDb();
      const newRecord = JSON.parse(body);
      data.push(newRecord);
      writeDb(data);
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(newRecord));
    });
    return;
  }

  if (method === 'DELETE' && pathname === '/data') {
    writeDb([]);
    res.end();
    return;
  }

  if (method === 'DELETE' && pathname === '/') {
    const id = parseInt(query.id);
    const data = readDb();
    data.splice(id, 1);
    writeDb(data);
    res.end();
    return;
  }

  if (method === 'PATCH' && pathname === '/') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const data = readDb();
      const updatedRecord = JSON.parse(body);
      data[updatedRecord.index].done = !data[updatedRecord.index].done;
      writeDb(data);
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(updatedRecord));
    });
    return;
  }

  res.statusCode = 404;
  res.end('404');
}).listen(PORT);

console.log(`http://localhost:${PORT}/`);
console.log(`GET ${PORT}/`);
console.log(`Post ${PORT}/ to create new ToDo`);
console.log(`PATCH ${PORT}/{id}`);
console.log(`DELETE ${PORT}/{id}`);