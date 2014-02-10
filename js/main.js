var fs = require('fs'),
    path = require('path');

var dirname = process.execPath.substr(0, process.execPath.lastIndexOf('/')); //the path of 'nw' file

var FILE_PATH = path.join(dirname, '..', '..', 'Documents', 'node-webkit');

var count = 0;

function deleteHelper(filePath, callback) {
    var files = [];
    if (fs.existsSync(filePath)) {
        files = fs.readdirSync(filePath);
        for (var i in files) {
            var curPath = filePath + '/' + files[i];
            if (fs.statSync(curPath).isDirectory()) {
                arguments.callee(curPath);
            } else if (path.extname(curPath) === '.test') {
                count++;
                fs.unlinkSync(curPath);
                console.log(curPath);
            }
        }
    }
};

deleteHelper(FILE_PATH);

$("#h-test").html("count:" + count);