$(function() {
    var fs = require('fs'),
        path = require('path');

    // var dirname = process.execPath.substr(0, process.execPath.lastIndexOf('/')); //the path of 'nw' file

    var $deleteBtn = $('#delete-btn');
    var $filetypeInput = $('#input-filetype');
    var $directoryInput = $('#input-directory');
    var $totalCountAlert = $('#total-count-alert');
    var $directoryErrorAlert = $('#directory-error-alert');

    var count = 0;

    function deleteHelper(filePath, filetype) {
        var files = [];
        if (fs.existsSync(filePath)) {
            try {
                files = fs.readdirSync(filePath);
                for (var i in files) {
                    var curPath = filePath + '/' + files[i];
                    if (fs.statSync(curPath).isDirectory()) {
                        arguments.callee(curPath, filetype);
                    } else if (path.extname(curPath) === filetype) {
                        count++;
                        fs.unlinkSync(curPath);
                        console.log(curPath);
                    }
                }
            } catch (e) {
                console.log(e.name + ':' + e.message);
            } finally {
                return true;
            }
        } else {
            return false;
        }
    };

    $deleteBtn.on('click', function() {
        $directoryErrorAlert.addClass('hide');
        $totalCountAlert.addClass('hide');
        var filePath = $.trim($directoryInput.val());
        var filetype = $.trim($filetypeInput.val());
        if (!deleteHelper(filePath, filetype)) {
            $directoryErrorAlert.removeClass('hide');
            $directoryInput.val('');
        } else {
            $totalCountAlert.html('total count:' + count)
                .removeClass('hide');
            $directoryInput.val('');
            $filetypeInput.val('');
            count = 0;
        }
    });

});