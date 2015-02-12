'use strict';

var _ = require('lodash');
var Cli = require('./cli.model');
var exec = require('child_process').exec;
var jsesc = require('jsesc');
// consider using execFile instead of exec:
// https://blog.liftsecurity.io/2014/08/19/Avoid-Command-Injection-Node.js?utm_source=ourjs.com

// Get list of clis
exports.index = function(req, res) {
  Cli.find(function (err, clis) {
    if(err) { return handleError(res, err); }
    return res.json(200, clis);
  });
};

// Get a single cli
exports.show = function(req, res) {
  Cli.findById(req.params.id, function (err, cli) {
    if(err) { return handleError(res, err); }
    if(!cli) { return res.send(404); }
    return res.json(cli);
  });
};

// Creates a new cli in the DB.
exports.create = function(req, res) {
  Cli.create(req.body, function(err, cli) {
    if(err) { return handleError(res, err); }
    return res.json(201, cli);
  });
};

// Updates an existing cli in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Cli.findById(req.params.id, function (err, cli) {
    if (err) { return handleError(res, err); }
    if(!cli) { return res.send(404); }
    var updated = _.merge(cli, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, cli);
    });
  });
};

// Deletes a cli from the DB.
exports.destroy = function(req, res) {
  Cli.findById(req.params.id, function (err, cli) {
    if(err) { return handleError(res, err); }
    if(!cli) { return res.send(404); }
    cli.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

// Compile java code
exports.compile = function(req, res) {
  var fileName = req.body.fileName;
  var className = req.body.className;
  var dirName = 'users/' + req.body.user._id + '/';
  var dateTime = new Date();
  dirName += dateTime.getMonth();
  dirName += dateTime.getDate();
  dirName += dateTime.getFullYear();

  //createCompileJavaFile(dirName, fileName, className, req.body.code, res);
  // make a directory for this user, if doesn't exist already
  exec("mkdir -p " + dirName, {timeout: 10000}, // Process will time out if running for > 10 seconds.
    function (error, stdout, stderr) {
      if (error) {
        console.error(stderr); // send to response?
        return res.send(200, stderr);
      } else {
        console.log(stdout);
        // create java file with |contents|
         console.log('heres code pre escaping:');
         console.log(req.body.code);
        // var obj = {'code': req.body.code };
        // console.log('heres obj');
        // console.log(obj);
         //console.log('heres plain code post escaping:');

        var escapedCode = jsesc(req.body.code, {
          //'quotes': 'double',
          'wrap': true
        });
         console.log("this is what im sending to echo: ");
         console.log(escapedCode);

        exec("echo $" + escapedCode + " > " + dirName + '/' + fileName, { timeout: 10000}, // Process will time out if running for > 10 seconds.
          function(error, stdout, stderr) {
          if (error) {
            console.error(stderr);
            return res.send(200, stderr);
          } else {
            console.log(stdout);
            console.log('file created successfully');
            //compileJavaFile("/Users/anna/Google\ Drive/Grad\ Studies/thesis/its110/" + dirName + '/' + fileName, res);
            compileJavaFile(dirName + '/' + fileName, res);
          }
        });
      }
    });
};

// run java code
exports.run = function(req, res) {
  var dirName = 'users/' + req.body.user._id + '/';
  var dateTime = new Date();
  dirName += dateTime.getMonth();
  dirName += dateTime.getDate();
  dirName += dateTime.getFullYear();
  exec('java -cp "'+ dirName + '" ' + req.body.className, {timeout: 10000}, // Process will time out if running for > 10 seconds.
    function (error, stdout, stderr) {
      if (error) {
        console.log('error error!!');
        console.log(error);
        console.log(error.killed);
        console.log(error.signal);
        console.error(stderr); 
        return res.send(200, error);
      } else {
        console.log(stdout);
        console.log(' '+ req.body.className + ' ran.');
        return res.send(200, stdout);
      }
    });

   
}


function compileJavaFile(srcFile, res) {
  // exec is asynchronous
  exec('javac "'+ srcFile + '"', {timeout: 10000}, // Process will time out if running for > 10 seconds.
    function (error, stdout, stderr) {
      if (error) {
        console.error(stderr);
        return res.send(200, stderr);
      } else {
        console.log(stdout);
        console.log(' '+ srcFile + ' compiled.');
        return res.send(stdout);
        //runJavaFile("/Users/anna/Google\ Drive/Grad\ Studies/thesis/its110/", className);
      }
    });
}

function run_cmd(cmd, args, callBack ) {
    var spawn = require('child_process').spawn;
    var child = spawn(cmd, args);
    var resp = "";

    child.stdout.on('data', function (buffer) { resp += buffer.toString() });
    child.stdout.on('end', function() { callBack (resp) });
}

run_cmd( "ls", ["-l"], function(text) { 
  console.log (text); 
});

// contents should be an html string with newline characters
function createCompileJavaFile(dirName, fileName, className, contents, res) {
  // make a directory for this user, if doesn't exist already
  exec("mkdir -p " + dirName, {timeout: 10000}, // Process will time out if running for > 10 seconds.
    function (error, stdout, stderr) {
      if (error) {
        console.error(stderr);
        return res.send(200, stderr);
      } else {
        console.log(stdout);
        //return res.send(200, stdout); 
        // create java file with |contents|
        console.log('heres contents:');
        console.log(contents);
        exec("echo $'" + contents + "' > " + dirName + '/' + fileName, {timeout: 10000}, // Process will time out if running for > 10 seconds.
          function(error, stdout, stderr) {
          if (error) {
            console.error(stderr);
            return res.send(200, stderr);
          } else {
            console.log(stdout);
            console.log('file created successfully');
            //compileJavaFile("/Users/anna/Google\ Drive/Grad\ Studies/thesis/its110/" + dirName + '/' + fileName, res);
            compileJavaFile(dirName + '/' + fileName, res);
          }
        });
      }
    });
}


function handleError(res, err) {
  return res.send(500, err);
}
