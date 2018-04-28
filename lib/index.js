const fs = require('fs');
const ip = require('ip');
const express = require('express');
const range = require('express-response-range');
const progress = require('progress');
const onFinished = require('on-finished');

let functions = require('./functions');

let settings = require('./settings');
//let device = 'Nintendo Switch';
let device = "Test";

let devices = {};

const PORT = 1337 | process.env.PORT;

console.log('httpnand v0 by @Dann_');
console.log(`Using device configuration: "${device}"`);

console.log("");

console.log("Parsing devices...");

for (let deviceName in settings.devices[device]) {
    let deviceSize = functions.device.getSize(deviceName);

    if (deviceSize > 0) {
        console.log(`Found device ${deviceName}!`);
        devices[deviceName] = {
            filename: settings.devices[device][deviceName],
            size: deviceSize
        };
    }
    else {
        console.log(`Could not find device ${deviceName}...`);
    }
}

let app = express();

app.use(range());
app.set('view engine', 'ejs');
app.set('views', __dirname);

app.get('/device/:deviceName', (request, response) => {
    let deviceName = request.params.deviceName;

    if (devices.hasOwnProperty(deviceName)) {
        console.log(`Starting download of ${devices[deviceName].filename}`);

        response.setHeader('Content-disposition', `attachment; filename=${devices[deviceName].filename}`);

        let stream = fs.createReadStream(`/dev/${deviceName}`, {
            start: request.range.offset
        });

        let totalDownloaded = 0;

        let bar = new progress(`${devices[deviceName].filename} [:bar] [:current/:total] :percent%`, {total: devices[deviceName].size});

        stream.on('data', chunk => {
            totalDownloaded += chunk.length;
        });

        let interval = setInterval(() => {
            bar.tick(totalDownloaded);
            totalDownloaded = 0;
        }, 2000);

        let clean = false;
        function cleanUp() {
            if (clean) {
                return;
            }
            clean = true;
            clearInterval(interval);
            console.log(`Stopped download of ${devices[deviceName].filename}`);
        }

        onFinished(request, () => {
            stream.destroy();
            cleanUp();
        });

        onFinished(response, () => {
            stream.destroy();
            cleanUp();
        });

        stream.pipe(response);
    }
    else {
        response.status(404);
        response.end();
    }
});

app.get('/', (request, response) => {
    console.log('/');
    response.render('index.ejs', {devices});
});

app.listen(PORT, () => {
    console.log(`Server listening on http://${ip.address()}:${PORT}/`);
});