const http = require('http');
const port = 3001;
const ip = require('ip');



const server = http.createServer((request, response) => {
    response.writeHead(200, {
        "Content-Type":"text/html"
    });

    const responseMessage = "<h1>Hello World</h1>";
    response.end(responseMessage);
    console.log(`Sent a response : ${responseMessage}`);
});

server.listen(port);

const host = ip.address();

console.log(`ℹ️ Listening on: http://${host}:${port}`);