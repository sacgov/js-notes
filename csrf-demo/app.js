const express = require('express');
const bodyParser = require('body-parser');
const csurf = require('csurf');
const cookieParser = require('cookie-parser');

const PORT = process.env.PORT || 3000;
const app = express();

const csrfMiddleware = csurf({
  cookie: true
});

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(csrfMiddleware);

app.get('/', (req, res) => {
  res.send(`
    <h1>Hello World</h1>
    <form action="/entry" method="POST">
      <div>
        <label for="message">Enter a message</label>
        <input id="message" name="message" type="text" />
      </div>
      <input type="submit" value="Submit" />
      <input type="hidden" name="_csrf" value="${req.csrfToken()}" />
    </form>
  `);
});

app.get('/etag', (req, res) => {
  res.send(`
    <html>
      <header>
        <title> Etag - 304 demo </title>
      </header>
        <body>
          <h1>Etag - 304 demo</h1>
          <script type="text/javascript">
            var data = null;

          var xhr = new XMLHttpRequest();
          xhr.withCredentials = true;

          xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
              console.log(this.responseText);
            }
          });

          xhr.open("GET", "/cache");
          xhr.setRequestHeader("Accept", "*/*");
          xhr.setRequestHeader("Postman-Token", "7cbd3d5f-603d-407c-8867-b80cf6bb25a3,a81fdfad-32d9-426a-86cb-7e800a95b2e3");
          xhr.setRequestHeader("Accept-Encoding", "gzip, deflate");
          xhr.setRequestHeader("Connection", "keep-alive");

          xhr.send(data);
          </script>

        </body>
    </html>

  `);
});
app.get('/cache', (req, res) => {
  res.set('Cache-Control', 'public, max-age=5');
  res.send(`
    A simple cache to check
  `);
});

app.post('/entry', (req, res) => {
  console.log(`Message received: ${req.body.message}`);
  res.send(`CSRF token used: ${req.body._csrf}, Message received: ${req.body.message}`);
});

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});