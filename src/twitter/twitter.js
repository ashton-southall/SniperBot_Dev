var Twit = require('twit') 
var T = new Twit({
  consumer_key:         'xK5Vsu3RX3MHnK4P5Lh7SkYd3',
  consumer_secret:      'Eps8TmEDs3x4ckYGZH12mmt0D0ZIvBZZkqcmCnYOD0IMjeQCZD',
  access_token:         '1263005028144435201-FQVCxtm7FwAsPce6DVeR4nc2ly6pDN',
  access_token_secret:  'igEHfbR9DqkN3NFqJMtX4lxiZtzbuqg4BoPawtArYTrCq',
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
  strictSSL:            true,     // optional - requires SSL certificates to be valid.
})
 
// start stream and track tweets
const TwitchStream = T.stream('statuses/filter', {track: 'twitch trolls'});

// event handler
TwitchStream.on('tweet', tweet => {
    console.log(tweet);
    T.post('favorites/create', {id: tweet.id_str});
});