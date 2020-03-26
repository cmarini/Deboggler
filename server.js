const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3001;
require('dotenv').config();

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

app.get('/api/definition/:word', function (req, res) {
    let word = req.params["word"];
    let url = `https://dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=${process.env.API_KEY}`;
    console.log(`looking up '${word}' with API_KEY=${process.env.API_KEY}`);
    console.log(url);
    axios.get(url)
        .then(response => {
            if (response.status !== 200) {
                console.log('Looks like there was a problem. Status Code: ' + response.status);
                return;
            }
            res.json(response.data);
        }
        )
        .catch((err) => {
            console.log('Fetch Error :', err);
            res.status(404).send({ error: err });
        });
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));