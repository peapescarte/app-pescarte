import app from './app';
import fs from 'fs';
import https from 'https';

const port = 8000;

const options = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.crt')
  };
  
const server = https.createServer(options, app);

server.listen(port, () => {
    console.log("Escutando na porta", port)
})