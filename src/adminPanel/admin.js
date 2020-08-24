const express = require("express");
const { list } = require("pm2");
const app = express();

// Express Settings
const host = 'localhost';
const port = 3000

// Page Routing
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/admin.html');
})
app.get('/master_kill', (req, res) => {
    process.exit(0);
})

app.get('/twitch_users', (req, res) => {
    res.sendFile(__dirname + '/twitch/users.json');
})
app.get('/twitch_log', (req, res) => {
    res.sendFile(__dirname + '/twitch/twitch.log');
})
app.get('/discord_log', (req, res) => {
    res.sendFile(__dirname + '/discord/discord.log');
})
app.get('/discord_users', (req, res) => {
    res.sendFile(__dirname + ('/discord/users.json'));
})

app.listen(port, () => console.log(`Admin app listening at http://localhost:${port}`))