const express = require('express');
const path = require('path');
const app = express();

const port = process.env.PORT || 8080;

// Serve static files from root directory
app.use(express.static(__dirname));

// Routes for static assets
app.use('/sui', express.static(path.join(__dirname, 'sui')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/sounds', express.static(path.join(__dirname, 'sounds')));

// Serve index.html from root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`Calendar app is running at http://localhost:${port}`);
    console.log('Press Ctrl+C to quit.');
});