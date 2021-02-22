const sqlite3 = require("sqlite3").verbose();

class SQLiteClient {
  constructor(dbSource) {
    this.dbSource = dbSource;
    this.connectDb((err, msg) => {
      if (err) {
        console.error(err);
      } else {
        console.log(msg);
        this.createTable((err) => {});
      }
    });
  }

  // Set connection
  connectDb(cb) {
    if (this.dbSource) {
      this.db = new sqlite3.Database(this.dbSource, (err) => {
        if (err) {
          cb(err.message, null);
        } else {
          const msg = `client connected successfully to database ${this.dbSource}`;
          cb(null, msg);
        }
      });
    } else {
      cb("data-source for sqlite connection is not provided", null);
    }
  }

  //Create table if doesnt exist
  createTable(cb) {
    const query = `CREATE TABLE tweets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      query text,
      tweet_id text UNIQUE,
      author_id text,
      author_screen_name text,
      author_profile_image text,
      tweet_text text,
      in_reply_to_user_id text
    )`;

    this.db.run(query, (err) => {
      cb(err);
    });
  }

  // Search and return all tweets from db based
  get_all(cb) {
    const sql = "select * from tweets order by tweet_id desc limit 1000";
    const params = [];
    if (this.db) {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          cb(err, null);
          return;
        }
        cb(null, rows);
        return;
      });
    }
  }

  //Search and return the latest (max id) tweets from db based on search term
  get_latest_tweet_id(search_term, cb) {
    const sql = "select max(tweet_id) as max_id from tweets where query = ?";
    const params = [search_term];
    if (this.db) {
      this.db.get(sql, params, (err, rows) => {
        if (err) {
          cb(err, null);
          return;
        }
        cb(null, rows);
        return;
      });
    }
  }

  //Search and return all tweets from db based on search term
  get_all_by_search_term(search_term, cb) {
    const sql =
      "select * from tweets where query = ? order by tweet_id desc limit 1000";
    const params = [search_term];
    if (this.db) {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          cb(err, null);
          return;
        }
        cb(null, rows);
        return;
      });
    }
  }

  //Search and return tweets by id
  get_tweet_by_id(id, cb) {
    const sql = "select *  from tweets where tweet_id = ?";
    const params = [id];
    if (this.db) {
      this.db.get(sql, params, (err, rows) => {
        if (err) {
          cb(err, null);
          return;
        }
        cb(null, rows);
        return;
      });
    }
  }

  // Insert records to tweets table
  insert(item, query, cb) {
    if (this.db) {
      const data = {
        author_id: item.user.id_str,
        tweet_id: item.id_str,
        author_profile_image: item.user.profile_image_url_https,
        author_screen_name: item.user.screen_name,
        query: query,
        tweet_text: item.text,
        in_reply_to_user_id: item.in_reply_to_user_id,
      };

      const sql =
        "INSERT INTO tweets (author_id, tweet_id, author_profile_image, author_screen_name, query, tweet_text,in_reply_to_user_id) VALUES (?,?,?,?,?,?,?)";

      const params = [
        data.author_id,
        data.tweet_id,
        data.author_profile_image,
        data.author_screen_name,
        data.query,
        data.tweet_text,
        data.in_reply_to_user_id,
      ];

      this.db.run(sql, params, function (err, result) {
        if (err) {
          cb(err, null);
          return;
        }
        cb(null, result);
        return;
      });
    } else {
      return cb("");
    }
  }

  // to delete the whole data from tweets table
  delete(cb) {
    if (this.db) {
      const query = `DELETE FROM tweets `;
      this.db.run(query, (err) => {
        if (err) {
          cb(err);
          return;
        }
        cb(null);
        return;
      });
    }
  }
}

module.exports = SQLiteClient;
