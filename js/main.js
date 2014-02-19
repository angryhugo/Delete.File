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
    var _timer;

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
        $deleteBtn.attr('disabled', true); //not work correctly
        setTimeout(function() {
            $directoryErrorAlert.addClass('hide');
            $totalCountAlert.addClass('hide');
            clearTimeout(_timer);
            var filePath = $.trim($directoryInput.val());
            var filetype = $.trim($filetypeInput.val());
            if (!deleteHelper(filePath, filetype)) {
                $directoryErrorAlert.removeClass('hide');
                _timer = setTimeout(function() {
                    $directoryErrorAlert.addClass('hide');
                }, 3000);
                $directoryInput.val('');
            } else {
                $totalCountAlert.html('total count:' + count)
                    .removeClass('hide');
                _timer = setTimeout(function() {
                    $totalCountAlert.addClass('hide');
                }, 3000);
                $directoryInput.val('');
                $filetypeInput.val('');
                count = 0;
            }
            $deleteBtn.attr('disabled', false);
        }, 500);
    });

});