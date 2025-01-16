const express = require('express');
const path = require('path');
const app = express();

const port = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname, 'public')));

//here where the photos are getting from oke
app.use('/sui', express.static(path.join(__dirname, 'sui')));

app.get('/', (req, res) => { res.sendFile(path.join(__dirname, 'public', 'index.html')); });

app.listen(port, () => {
    console.log(`Calendar app is running at http://localhost:${port}`);
    console.log('Press Ctrl+C to quit.');
});