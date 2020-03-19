const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static(path.join(__dirname, 'build')));

app.get('/ping', function (req, res) {
    return res.send('pong');
});

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get('/dict', function (req, res) {
    console.log("REQUEST DICT");
    res.sendFile(path.join(__dirname, 'static', 'dict.json'));
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));