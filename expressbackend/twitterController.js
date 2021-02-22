const twit = require("twit");

class TwitterClient {
  constructor() {
    this.twit = new twit({
      consumer_key: process.env.TWITTER_CONSUMER_KEY,
      consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
      access_token: process.env.TWITTER_ACCESS_TOKEN,
      access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
      timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
      strictSSL: true, // optional - requires SSL certificates to be valid.
    });
  }

  fetch(query, count = 50, cb) {
    if (this.twit) {
      this.twit.get(
        "search/tweets",
        { q: query, count: count },
        (err, data) => {
          if (err) {
            cb(err, null);
            return;
          }
          cb(null, data);
          return;
        }
      );
    } else {
      cb("twitter client not initialized properly", null);
    }
  }
}

module.exports = TwitterClient;
