var stdout = "", stderr = "";
var child = process.createChildProcess("someCommand");

child.addListener("output", function (data) {
    if (data !== null) {
        stdout += data;
    }
});
child.addListener("error", function (data) {
    if (data !== null) {
        stderr += data;
    }
});
child.addListener("exit", function (code) {
    if (code === 0) {
        sys.puts(stdout);
    }
    else {
        // error
    }
});

child.write("This goes to someCommand's stdin.");