# delist_util
This is a small utility that polls binance news for any delisted pairs every 15 seconds, and then blacklists pairs via each freqtrade bot's api as well as config file if the pairs aren't already blacklisted.

### Requirements
* One or more [freqtrade](https://github.com/freqtrade/freqtrade) bots with the api server enabled.
* [Nodejs](https://nodejs.org/) v15.3.0 and up for source install, or
* [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) for containerized install.

### Installation (Source)
Clone the repo.

Run `npm install` inside the cloned folder to install dependencies. Alternatively you can use yarn, should you wish to do so.

Adjust the `instances.json` file to your needs (see below).

Run the util with `node .`, preferably inside a screen or tmux session so you can detach.

For each bot you have, add an object to the `instances.json` file with the following contents:
```javascript
{
    "ip": "127.0.0.1",                                          // IP of the api server.
    "port": 8080,                                               // Port of the api server
    "user": "myuser",                                           // Username of the api server
    "pass": "MySecretPassword",                                 // Password of the api server
    "config": "/home/myuser/ft_userdata/user_data/config.json"  // Config file location, this can either be relative or absolute.
}
```
### Installation (Docker)
Clone the repo.

Run `docker-compose build` to build the docker image.

Add this to the bottom of your freqtrade's docker-compose.yml:
```yml
networks:
  freqtrade:
    name: freqtrade
    driver: bridge
    ipam:
      config:
        - subnet: 172.31.0.0/16
          gateway: 172.31.0.1
```
Add this to each freqtrade service, incrementing the last number in the ip for each service:
```yml
networks:
  freqtrade:
    ipv4_address: 172.31.0.100
```
Adjust the volume mapping in the delist_util's docker-compose.yml so that it is properly mapped to your freqtrade folder.

For each bot you have, add an object to the `instances.json` file with the following contents:
```javascript
{
    "ip": "172.31.0.100",                                       // IP of the api server.
    "port": 8080,                                               // Port of the api server.
    "user": "myuser",                                           // Username of the api server.
    "pass": "MySecretPassword",                                 // Password of the api server.
    "config": "/freqtrade/user_data/config.json"                // Config file location, this can either be relative or absolute.
}
```
The ip should match the ipv4_address you've specified in your freqtrade docker-compose.yml, and the port should match the port set in your config.json as docker networks ignore the port mapping done in the file.

If the docker-compose.yml volume mapping is set up like the example, then the config path should match the config path you'd normally use in your `--config` argument in the command section of your freqtrade services.

Finally, start up the docker container with `docker-compose up -d`.

The `instances.json` file has three dummy instances added to give you an example of how the file should look.
