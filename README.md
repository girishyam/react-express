
# Getting Started 

This project have 2 components.

 * Express/node app for the backend in `expressbackend` folder.
        It will run on port 3001
 * React app for the front end in `reactclient` folder.
        This will run on port 3000

You need nodejs installed in your machine.
You will need Twitter API credentials from Twitter developer site.

## Clone and installation
 clone the repo
```
     git hub clone 
```
 Install dependencies for both the apps by running npm install on expressbackend and reactclient folders
```
$ cd your-folder-path/expressbackend
$ npm install
$ cd your-folder-path/reactclient
$ npm install
```
 Copy `sample.env` in expressbackend folder to `.env` and set Twitter api credentials in it.

```
PORT=3001
TWITTER_CONSUMER_KEY=<your-twitter-consumer-key>
TWITTER_CONSUMER_SECRET=<your-twitter-consumer-secret-key>
TWITTER_ACCESS_TOKEN=<your-twitter-access-secrt-token>
TWITTER_ACCESS_TOKEN_SECRET=<your-twitter-access-secrt-token-secret>
```


## Running app 

You will need to run these 2 apps seperately. To run backend app navigate to `expressbackend` folder and run
```
$ cd your-folder-path/expressbackend
$ node server.js
```

To run frontend app navigate to `reactclient` folder and run
```
$ cd your-folder-path/reactclient
$ npm start
```
Once successfully done the website will be available to browse on
```
$ open http://localhost:3000
```