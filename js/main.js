$(function() {
    var fs = require('fs'),
        path = require('path');

    // var dirname = process.execPath.substr(0, process.execPath.lastIndexOf('/')); //the path of 'nw' file

    var $deleteBtn = $('#delete-btn');
    var $extNameInput = $('#input-extname');
    var $directoryInput = $('#input-directory');
    var $totalCountAlert = $('#total-count-alert');
    var $directoryErrorAlert = $('#directory-error-alert');
    var $processModal = $('#process-modal');
    var $alertMsg = $('#alert-msg');
    var $closeModalBtn = $('#btn-close-modal');

    var Message = {
        DELETE_CONFIRM1: 'Are you sure to delete *',
        DELETE_CONFIRM2: ' in ',
        DELETE_CONFIRM3: ' ?',
        INPUT_ERROR: '"Type" and "Directory" could not be empty!',
        INVALID_PATH: 'invalid directory!',
        DELETE_SUCCESS: ' file(s) has been deleted!',
        BEING_PROCESSED: 'Being processed...'
    };

    var count = 0;

    function deleteHelper(directory, extName) {
        var files = [];
        if (fs.existsSync(directory)) {
            try {
                files = fs.readdirSync(directory);
                for (var i in files) {
                    var curPath = directory + '/' + files[i];
                    if (fs.statSync(curPath).isDirectory()) {
                        arguments.callee(curPath, extName);
                    } else if (path.extname(curPath) === extName) {
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
        var extName = $.trim($extNameInput.val());
        var directory = $.trim($directoryInput.val());
        if (extName === '' || directory === '') {
            bootbox.alert(Message.INPUT_ERROR);
        } else {
            bootbox.confirm(Message.DELETE_CONFIRM1 + extName + Message.DELETE_CONFIRM2 + directory + Message.DELETE_CONFIRM3, function(result) {
                if (result) {
                    $alertMsg.html(Message.BEING_PROCESSED)
                        .css('color', 'black');
                    $closeModalBtn.hide();
                    $processModal.modal({
                        backdrop: "static"
                    });
                    setTimeout(function() {
                        if (!deleteHelper(directory, extName)) {
                            $directoryInput.val('');
                            $alertMsg.html(Message.INVALID_PATH)
                                .css('color', 'red');
                            $closeModalBtn.show();
                        } else {
                            $directoryInput.val('');
                            $extNameInput.val('');
                            $alertMsg.html(count + Message.DELETE_SUCCESS)
                                .css('color', 'green');
                            $closeModalBtn.show();
                            count = 0;
                        }
                    }, 500);
                }
            });
        }
    });

});