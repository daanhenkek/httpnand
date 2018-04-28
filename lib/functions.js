const fs = require('fs');

let device = {};

device.getBlockSize = function (deviceName) {
    try {
        return fs.readFileSync(`/sys/block/${deviceName}/queue/physical_block_size`);
    }
    catch(err) {
        return null;
    }
};

device.getBlockCount = function (deviceName) {
    try {
        return fs.readFileSync(`/sys/block/${deviceName}/size`);
    }
    catch(err) {
        return null;
    }
};

device.getSize = function (deviceName) {
    return device.getBlockSize(deviceName) * device.getBlockCount(deviceName);
};

module.exports = {
    device
};