$(function() {
    var fs = require('fs'),
        path = require('path');

    // var dirname = process.execPath.substr(0, process.execPath.lastIndexOf('/')); //the path of 'nw' file

    var $deleteBtn = $('#delete-btn');
    var $filetypeInput = $('#input-filetype');
    var $directoryInput = $('#input-directory');
    var $totalCountAlert = $('#total-count-alert');
    var $directoryErrorAlert = $('#directory-error-alert');
    var $processModal = $('#process-modal');
    var $alertMsg = $('#alert-msg');
    var $closeModalBtn = $('#btn-close-modal');

    var Message = {
        INVALID_PATH: 'invalid directory!',
        DELETE_SUCCESS: ' file(s) has been deleted!',
        BEING_PROCESSED: 'Being processed...'
    };

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
        $alertMsg.html(Message.BEING_PROCESSED).css('color', 'black');
        $closeModalBtn.hide();
        $processModal.modal({
            backdrop: "static"
        });
        setTimeout(function() {
            var filePath = $.trim($directoryInput.val());
            var filetype = $.trim($filetypeInput.val());
            if (!deleteHelper(filePath, filetype)) {
                $directoryInput.val('');
                $alertMsg.html(Message.INVALID_PATH).css('color', 'red');
                $closeModalBtn.show();
            } else {
                $directoryInput.val('');
                $filetypeInput.val('');
                $alertMsg.html(count + Message.DELETE_SUCCESS).css('color', 'green');
                $closeModalBtn.show();
                count = 0;
            }
        }, 500);
    });

});