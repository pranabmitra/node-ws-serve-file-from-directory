const WebSocket = require('ws');
const fs = require('fs');
const wss = new WebSocket.Server({ port: 9001});

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);

    });

    var testFolder = './liveChannelArchive/';
    var allFiles = [],
        tempFiles = [],
        tempCount = 0;

    fs.readdir(testFolder, (err, files) => {
       allFiles = files;
       tempFiles = JSON.parse(JSON.stringify(files));
       sendByteStream(allFiles.shift());
    });

    function sendByteStream(fileName) {
        console.log(fileName);
        var file = './' + testFolder + '/' + fileName;

        if (fs.existsSync(file)) {
            var stat = fs.statSync(file);

            fs.readFile(file, function(err, data){
                if(err) { console.log(err); }
                ws.send((data));
            });
        } else {
            // ws.send('No more files!');
        }

        tempCount++;

        if (allFiles.length) {
            setTimeout(function delayFunc() {
                sendByteStream(allFiles.shift());
            }, 100);
        } else {
            if (tempCount > 1) {
                allFiles = JSON.parse(JSON.stringify(tempFiles));
                sendByteStream(allFiles.shift());
            }
        }

    }

});
