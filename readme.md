#httpnand

httpnand is a tool that allows you to dump your nand over http.
It was designed to be used for dumping the nand of the Nintendo Switch but it should be able
to dump any /dev device on linux

####Requirements
* Linux running on your Nintendo Switch
* NodeJS and NPM

####Usage
To use httpnand you just clone to project on your Nintendo Switch, cd into the directory and run
```
npm start
```

The server should start and it should output your Nintendo Switch's ip address and the port it's listening to.

On your computer you just open a browser and go to the url displayed on your Switch.
It should open a list of links to all the different dumpable devices.

Alternatively you can go download specific devices (boot0 for example) by going to ip:port/device/mmcblk1boot0.