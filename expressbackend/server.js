require("dotenv/config");

const SQLiteClient = require("./sqliteController");
const TwitterClient = require("./twitterController");
const dbClient = new SQLiteClient("db.sqlite");
const twitterClient = new TwitterClient();

var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var cors = require("cors");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

var HTTP_PORT = process.env.PORT || 3001;
// Start server
app.listen(HTTP_PORT, () => {
  console.log("Server running on port %PORT%".replace("%PORT%", HTTP_PORT));
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({ message: "Ok" });
});

// endpoint to pull all the tweets from DB
app.get("/api/tweets", (req, res) => {
  dbClient.get_all((err, data) => {
    if (err) {
      res.status(500).json({ message: err });
    } else {
      res.status(200).json({
        data: data,
      });
    }
  });
});

// endpoint to delete all the tweets from DB
app.delete("/api/tweet/all", (req, res) => {
  dbClient.delete((err) => {
    if (err) {
      res.status(500).json({ message: "error in deleting tweets" });
    } else {
      res.status(200).json({ message: "tweets deleted successfully" });
    }
  });
});

// endpoint to fetch and save tweets
app.post("/api/fetch/tweets", (req, res) => {
  var errors = [];
  if (!req.body.query) {
    errors.push("No query specified");
  }

  if (errors.length) {
    res.status(400).json({ message: errors.join(", ") });
    return;
  }

  var incoming_search_q = req.body.query.toLowerCase();
  var transformed_q = incoming_search_q;

  // check if we have cached results for the search phrase and pick the latest tweet_id then append query string with it
  dbClient.get_latest_tweet_id(incoming_search_q, (errored, data) => {
    if (!errored) {
      transformed_q = data.max_id
        ? transformed_q + "&since_id=" + data.max_id
        : incoming_search_q;
    } else {
      res.status(500).json({ message: errored });
    }

    //call twitter and fetch results
    twitterClient.fetch(transformed_q, 20, (fetcherror, data) => {
      if (!fetcherror) {
        let recordsToInsert = data.statuses.length;
        let insertErr = null;

        // check if any tweets received
        if (data.statuses.length) {
          let i = 0;
          var dup_failed_ids = "";

          // insert records to db
          data.statuses.forEach((element) => {
            i++;
            dbClient.insert(element, incoming_search_q, (inserror) => {
              recordsToInsert--;
              if (inserror) {
                insertErr = true;
                dup_failed_ids += ` ${element.id_str}`;
                console.error(`error inserting tweet ${element.id_str} ...`);
              } else {
                console.log(
                  `tweet ${element.id_str} inserted successfully ...`
                );
              }

              if (recordsToInsert === 0) {
                //get full list of result for the search term from DB
                dbClient.get_all_by_search_term(
                  incoming_search_q,
                  (sercherror, data) => {
                    if (!sercherror) {
                      var resMessage = dup_failed_ids
                        ? `These failed: (${i}) ${dup_failed_ids}`
                        : null;
                      res.json({ data: data, message: resMessage });
                    } else {
                      res.status(500).json({ message: sercherror });
                    }
                  }
                );
              }
            });
          });
        } else {
          //get full list of result for the search term from DB
          dbClient.get_all_by_search_term(incoming_search_q, (err, data) => {
            if (!err) {
              res.json({
                data: data,
                message: "You are up todate with this one",
              });
            } else {
              res.status(500).json({ message: err });
            }
          });
        }
      } else {
        res.status(200).json({
          data: [],
          error: err,
          message: "Failed to contact twitter, contact your admin.",
        });
      }
    });
  });
});

// Through error for undefined routes
app.use(function (_, res) {
  res.status(404).json({ status: 404, message: "Method Not Found" });
});
