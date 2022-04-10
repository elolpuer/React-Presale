const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'build')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

async function start() {
    try {
        app.listen(5000, () =>
            console.log(`Server has been started on port ${5000}...`)
        )
    } catch (error) {
        console.error(error)
    }
}

start()
