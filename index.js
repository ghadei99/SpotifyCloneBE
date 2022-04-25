const express = require('express')
const spotifyApi = require('spotify-web-api-node');
const Lyrics = require('song-lyrics-api');

const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const cors = require('cors');
const SpotifyWebApi = require('spotify-web-api-node');
app.use(cors())

const port = process.env.PORT

const client_id = process.env.client_id;
const redirect_uri = process.env.redirect_uri;
const clientSecret = process.env.clientSecret;

app.post("/login", (req, res) => {
    console.log('In the login function!')
    // const state = generateRandomString(16);
    // const scope = 'user-read-private user-read-email';
    const code = req.body.code
    const spotifyApi = new SpotifyWebApi({

        redirectUri: process.env.redirect_uri,
        clientId: process.env.client_id,
        clientSecret: process.env.clientSecret,
    })

    spotifyApi
        .authorizationCodeGrant(code)
        .then(data => {
            res.json({
                accessToken: data.body.access_token,
                refreshToken: data.body.refresh_token,
                expiresIn: data.body.expires_in,
            })
        }).catch((e) => {
            res.status(400).send({ message: e })
        })
});

app.post("/refresh", (req, res) => {
    console.log('in the refresh function!')
    const refreshToken = req.body.refreshToken
    const spotifyApi = new SpotifyWebApi({
        redirectUri: process.env.redirect_uri,
        clientId: process.env.client_id,
        clientSecret: process.env.clientSecret,
        refreshToken
    })

    spotifyApi
        .refreshAccessToken()
        .then((data) => {
            res.json({
                accessToken: data.body.access_token,
                expiresIn: data.body.expires_in,
            })
        })
        .catch(() => {
            res.sendStatus(400)
        })
})

const lyrics = new Lyrics();
app.post("/lyrics", (req, res) => {
    const name = req.body.name
    console.log('song name is :- ', name)
    lyrics.getLyrics(name)
        .then((response) => {
            res.json({
                message: response
            })
            // return console.log(response);
        })
        .catch((error) => {
            res.sendStatus(400)
            return console.log(error);
        })
})

app.get('/testing', (req, res) => {
    res.status(200).send({
        client_id: process.env.client_id,
        redirect_uri: process.env.redirect_uri,
        clientSecret: process.env.clientSecret
    })
})


app.listen(port, () => {
    console.log('Server started at :- ', port);
})