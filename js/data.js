// Data Class
var Data = (function() {
    var data = [];
    var form = $("#form");

    function getData(callback) {
        var stringOfData = "";
        chrome.storage.local.get(function(storedData) {
            var entries = storedData.entries;
            $.each(entries, function(index, ele) {

                var t = new Date( ele.timeSet );
                var formatted = t.toUTCString().replace(',', '');

                var lineArray = [
                    formatted,
                    ele.first_name,
                    ele.last_name,
                    ele.company,
                    ele.email,
                    ele.phone
                ];
                arrayToLine = lineArray.join() + "\n";
                stringOfData += arrayToLine;
            });
            callback(stringOfData);
        });
    }

    function saveData () {
        getFormData(function() {
            if (data) {
                chrome.storage.local.get(function(storedData) {
                    var entries = storedData.entries;
                    if (!entries) {
                        entries = [];
                    }
                    entries.push({
                        timeSet:Date.now(),
                        first_name: data[0],
                        last_name: data[1],
                        company: data[2],
                        email: data[3],
                        phone: data[4]
                    });
                    chrome.storage.local.set({
                        entries: entries
                    });
                });
                handleSuccess();
                resetForm();
            } else {
                console.log("no data found");
            }
        });
    }

    function resetForm() {
        var errors = false;
        $.each($(form).find("input, textarea"), function(index, ele) {
            $(ele).val("");
        });
    }

    function resetData() {
        chrome.storage.local.clear();
        handleReset();
    }

    function getFormData(callback) {
        var errors = false;
        var required = ["first_name","last_name","email"];
        $.each($(form).find("input, textarea"), function(index, ele) {
            if($.inArray($(ele).attr("id"), required) > -1 && $(ele).val() === "") {
                $(ele).parent(".form-group").addClass("has-error");
                errors = true;
            } else {
                data.push($(ele).val());
            }
        });
        if (!errors) {
            callback();
        } else {
            handleError();
        }
    }

    function handleError() {
        $.notify("Error: Please complete required fields", "error");
    }

    function handleSuccess() {
        $.notify("Success: Thank you for submitting your information!", "success");
        events.emit('faceSwitch');
    }

    function handleReset() {
        $.notify("Success: Database empty", "success");
    }

    return {
        saveData: saveData,
        getData: getData,
        resetData: resetData
    };
});

var File = (function() {

    var fileName = Date.now() + "-ThermoApp-Entries.csv";

    function writeFile() {

        var data = Data();

        chrome.fileSystem.chooseEntry({
            type: 'saveFile',
            suggestedName: fileName
        }, function(writableFileEntry) {
            writableFileEntry.createWriter(function(writer) {
                writer.onwriteend = function(e) {
                    console.log('write complete');
                };
                data.getData(function(dataString) {
                    writer.write(new Blob([dataString], {
                        type: 'text/csv'
                    }));
                    handleSuccess();
                });
            }, function() {
                console.log('write error');
            });
        });
    }

    function handleSuccess() {
        $.notify("Success: File data exported to disk!", "success");
    }

    return {
        writeFile: writeFile
    };

});

// Ready
$(function() {

    $("#form").submit(function(e) {
        e.preventDefault();
        $(this).prop('disabled', true);
        var newFormEntry = Data();
        newFormEntry.saveData();
        $(this).prop('disabled', false);
    });

    $("#export-results").on("click", function() {
        var file = File();
        file.writeFile();
    });

    $("#empty-results").on("click", function() {
        var data = Data();
        data.resetData();
    });

});
