'use strict';

var _ = require('lodash');
var exec = require('child_process').exec;
var jsesc = require('jsesc');

function handleError(res, err) {
  return res.send(500, err);
}

// Compile java code
exports.compile = function (req, res) {
  var fileName = req.body.fileName;
  var dirName = 'users/' + req.body.user._id + '/';
  var dateTime = new Date();
  dirName += dateTime.getMonth();
  dirName += dateTime.getDate();
  dirName += dateTime.getFullYear();

  // make a directory for this user, if doesn't exist already
  exec('mkdir -p ' + dirName, { timeout: 10000 }, // Process will time out if running for > 10 seconds.
    function (error, stdout, stderr) {
      if (error) {
        return res.send(200, stderr);
      }

      var escapedCode = jsesc(req.body.code, {
        wrap: true
      });
      exec('echo ' + escapedCode + ' > ' + dirName + '/' + fileName, { timeout: 10000 }, // Process will time out if running for > 10 seconds.
          function (error, stdout, stderr) {
            if (error) {
              return res.send(200, stderr);
            }
            compileJavaFile(dirName + '/' + fileName, dirName, res);
          });
    });
};

// run java code
exports.run = function (req, res) {
  var dirName = 'users/' + req.body.user._id + '/';
  var dateTime = new Date();
  dirName += dateTime.getMonth();
  dirName += dateTime.getDate();
  dirName += dateTime.getFullYear();
  var execFile = req.body.fileName.replace('.c', '');
  var cmd = '"' + dirName + '/' + execFile + '"';
  var cp = exec(cmd, { timeout: 10000 }, // Process will time out if running for > 10 seconds.
    function (error, stdout, stderr) {
      if (error) {
        return res.send(200, error);
      }
      if (error !== null) {
      }
      return res.send(200, stdout);
    });
};


function compileJavaFile(srcFile, dirName, res) {
  var execFile = srcFile.replace('.c', '');
  // exec is asynchronous
  exec('gcc "' + srcFile + '" -o "' + execFile + '"', { timeout: 10000 }, // Process will time out if running for > 10 seconds.
    function (error, stdout, stderr) {
      if (error) {
        return res.send(200, stderr);
      }
      return res.send(stdout);
    });
}

function run_cmd(cmd, args, callBack) {
  var spawn = require('child_process').spawn;
  var child = spawn(cmd, args);
  var resp = '';

  child.stdout.on('data', function (buffer) { resp += buffer.toString(); });
  child.stdout.on('end', function () { callBack(resp); });
}

// contents should be an html string with newline characters
function createCompileJavaFile(dirName, fileName, className, contents, res) {
  // make a directory for this user, if doesn't exist already
  exec('mkdir -p ' + dirName, { timeout: 10000 }, // Process will time out if running for > 10 seconds.
    function (error, stdout, stderr) {
      if (error) {
        return res.send(200, stderr);
      }
        // create java file with |contents|
      exec("echo $'" + contents + "' > " + dirName + '/' + fileName, { timeout: 10000 }, // Process will time out if running for > 10 seconds.
          function (error, stdout, stderr) {
            if (error) {
              return res.send(200, stderr);
            }
            compileJavaFile(dirName + '/' + fileName, dirName, res);
          });
    });
}
