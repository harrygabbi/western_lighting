// server.js
const { createServer } = require("http");
const next = require("next");

const dev = false;
const app = next({ dev });
const handle = app.getRequestHandler();
const PORT = process.env.PORT || 3000;

app.prepare().then(() => {
  createServer((req, res) => handle(req, res)).listen(PORT, () => {
    console.log(`> Ready on port ${PORT}`);
  });
});
