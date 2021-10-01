# delist_util
This is a small utility that polls binance news for any delisted pairs every 15 seconds, and then blacklists pairs via each freqtrade bot's api as well as config file if the pairs aren't already blacklisted.

### Requirements
* One or more [freqtrade](https://github.com/freqtrade/freqtrade) bots with the api server enabled.
* [Nodejs](https://nodejs.org/) v15.3.0 and up.

### How to use
1. Clone the repo.
2. Run `npm install` inside the cloned folder to install dependencies. Alternatively you can use yarn, should you wish to do so.
3. Adjust the `instances.json` file to your needs (see below).
4. Run `node .` to start the util, preferably inside a screen or tmux session so you can detach.

For each bot you have, add an object to the `instances.json` file with the following contents:
```javascript
{
    "ip": "127.0.0.1",                                          // IP of the api server. Optional, when ommitted defaults to 127.0.0.1
    "port": 8080,                                               // Port of the api server
    "user": "myuser",                                           // Username of the api server
    "pass": "MySecretPassword",                                 // Password of the api server
    "config": "/home/myuser/ft_userdata/user_data/config.json"  // Config file location, this can either be relative or absolute.
}
```
The `instances.json` file has three dummy instances added to give you an example of how the file should look.
