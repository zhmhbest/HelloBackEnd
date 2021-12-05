const { createServer } = require("http");
const serverHost = '0.0.0.0';
const serverPort = 9999;
createServer(
    /**
     * @callback
     * @param {IncomingMessage} req
     * @param {ServerResponse} res
     */
    (req, res) => {
    // Request
    const requestHttpVersion = req.httpVersion;
    const requestMethod = req.method;
    const requestPath = req.url;
    /** @type {IncomingHttpHeaders} */
    const requestHeaders = req.headers;
    const contentLength = parseInt(requestHeaders['content-length'] || '0');
    const contentChunks = [];
    req.on('data', (chunk) => contentChunks.push(chunk));
    // Response
    const responseEvent = () => {
        const contentBody = contentChunks.length > 0 ? contentChunks.join('') : null;
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify({
            line: {
                version: requestHttpVersion,
                method: requestMethod,
                path: requestPath
            },
            headers: requestHeaders,
            body: contentBody
        }));
        res.end();
    };
    // MakeResponse
    if (contentLength > 0) {
        req.on('end', responseEvent);
    } else {
        responseEvent();
    }

}).listen(serverPort, serverHost, () => {
    console.log(`Web Server started at http://${serverHost}:${serverPort}`);
});