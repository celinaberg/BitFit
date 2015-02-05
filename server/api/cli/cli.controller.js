'use strict';

var _ = require('lodash');
var Cli = require('./cli.model');
var exec = require('child_process').exec;
var jsesc = require('jsesc');


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

// compile java code
exports.compile = function(req, res) {
  console.log('hey im in cli compile func. heres req.body');
  console.log(req.body);
  var fileName = req.body.fileName;
  var className = req.body.className;
  var dirName = 'users/' + req.body.user._id + '/';
  var dateTime = new Date();
  dirName += dateTime.getMonth();
  dirName += dateTime.getDate();
  dirName += dateTime.getFullYear();

  //createCompileJavaFile(dirName, fileName, className, req.body.code, res);
  // make a directory for this user, if doesn't exist already
  exec("mkdir -p " + dirName, 
    function (error, stdout, stderr) {
      if (error) {
        console.error(stderr); // send to response?
        return res.send(200, stderr);
        process.exit(1);
      } else {
        console.log(stdout);
        // create java file with |contents|
        console.log('heres code pre escaping:');
        // FIXME this still doesn't work for escape characters...
        console.log(req.body.code);
        var obj = {'code': req.body.code };
        console.log('heres obj');
        console.log(obj);
        console.log('heres plain code post escaping:');
/*
        var escapedObjCode = jsesc(obj, {
          'quotes': 'single',
          'wrap': false,
        });
        console.log('heres escapedObjCode:');
        console.log(escapedObjCode);
        */
        //var finalCodeString = escapedObjCode.slice(8, escapedObjCode.length-1);
        //console.log('heres finalCodeString:');
        //console.log(finalCodeString);
/*
    var endsWith = function(str, suffix) {
      return str.indexOf(suffix, str.length - suffix.length) !== -1;
    };


    var getClassName = function() {
      if (endsWith($scope.className, '.java')) {
        $scope.className.slice(0, -5);
        return $scope.className.slice(0, -5);
      }

*/
      //finalCodeString = "public class Test {\n    public static void main(String args[]) {\n        System.out.println(\"Hello my worldy's wo \\\\ rld!\");\n    }\n}";
//  this worked partially:      exec("echo $" + JSON.stringify(req.body.code) + " > " + dirName + '/' + fileName, function(error, stdout, stderr) {
        //exec("CODE=")

        // EXPERIMENT 1
        // escapedCode - using quotes= double, wrap= true, and "echo '" + escapedCode + "' >..."
        //             -  can't have a single apostrophe inside a s.o.pln statemtn
        //             - does leave newlines intact inside s.o.pln statements

        // EXPERIMENT 2
       // escapedCode - using quotes= double, wrap= false, and "echo '" + escapedCode + "' >..."
        //             -  single apostrophe inside a s.o.pln statement? ?? 
        //             -  newlines intact inside s.o.pln statements? ??
        //             - DOESN't compile code!

        // EXPERIMENT 3
       // escapedCode - using quotes= double, wrap= false, and "echo '$" + escapedCode + "' >..."
        //             -  single apostrophe inside a s.o.pln statement? ?? 
        //             -  newlines intact inside s.o.pln statements? ??
        //             - DOESN't compile code!        


        // EXPERIMENT 4
       // escapedCode - using quotes= double, wrap= true, and "echo '$" + escapedCode + "' >..."
        //             -  single apostrophe inside a s.o.pln statement? ?? 
        //             -  newlines intact inside s.o.pln statements? ??
        //             - DOESN't compile code!   
        
        // EXPERIMENT 5
       // escapedCode - using quotes= double, wrap= true, and "echo $" + escapedCode + " >..."
        //             -  single apostrophe inside a s.o.pln statement? OK ... tabs? OK
        //             -  backslash inside a s.o.pln statement? Yes, IF i add an extra \ in ace editor
        //             -  newlines intact inside s.o.pln statements? Yes, IF I add an extra \ in the Ace editor
        //             -  ** FIX ** could use background tokenizer inside ace editor to find and replace all instances?
        //             -  ** FIX ** or could search for \n and \\ instances here...


        var escapedCode = jsesc(req.body.code, {
          'quotes': 'double',
          'wrap': true
        });
        console.log("this is what im sending to echo: ");
        console.log(escapedCode);

        exec("echo $" + escapedCode + " > " + dirName + '/' + fileName, function(error, stdout, stderr) {
          if (error) {
            console.error(stderr);
            return res.send(200, stderr);
            process.exit(1);
          } else {
            console.log(stdout);
            console.log('file created successfully');
            compileJavaFile("/Users/anna/Google\ Drive/Grad\ Studies/thesis/its110/" + dirName + '/' + fileName, res);
          }
        });
      }
    });

  // exec is asynchronous
  /*exec('javac "'+ srcFile + '"',
    function (error, stdout, stderr) {
      if (error) {
        console.error(stderr);
        process.exit(1);
      } else {
        console.log(stdout);
        console.log(' '+ srcFile + ' compiled.');
        runJavaFile("/Users/anna/Google\ Drive/Grad\ Studies/thesis/its110/", className);
      }
    });
*/
  // create a .java file using code in request
  // run javac on command
  // feed output back client. 
  // do i need to open a connection of some sort?
  // naming convention?
  // userID/date/questionNumAttemptNum.java ?? 
};

// run java code
exports.run = function(req, res) {
  
  var dirName = 'users/' + req.body.user._id + '/';
  var dateTime = new Date();
  dirName += dateTime.getMonth();
  dirName += dateTime.getDate();
  dirName += dateTime.getFullYear();
  exec('java -cp "'+ dirName + '" ' + req.body.className,
    function (error, stdout, stderr) {
      if (error) {
        console.error(stderr);
        return res.send(200, stderr);
        process.exit(1);
      } else {
        console.log(stdout);
        console.log(' '+ req.body.className + ' ran.');
        return res.send(200, stdout);
      }
    });
   
}

 

function runJavaFile(srcFile, className) {
  //console.log('in run java srcFile: ' + srcFile + ' classname: ' + className);
// exec is asynchronous
  exec('java -cp "'+ srcFile + '" ' + className,
    function (error, stdout, stderr) {
      if (error) {
        console.error(stderr);
        process.exit(1);
      } else {
        console.log(stdout);
        console.log(' '+ className + ' ran.');
      }
    });
}

function compileJavaFile(srcFile, res) {
  // exec is asynchronous
  exec('javac "'+ srcFile + '"',
    function (error, stdout, stderr) {
      if (error) {
        console.error(stderr);
        return res.send(200, stderr);
        process.exit(1);
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
  //exec("echo 'Hello, world yahoo.' > foo.java", function(error, stdout, stderr) {
  //var lines = contents.split("\n");
  //console.log(fileName);
/*
  lines.forEach(function(ea) {
    ea = "'" + ea + "'";
    console.log(ea);
  })
  console.log(lines.toString());
*/





  // make a directory for this user, if doesn't exist already
  exec("mkdir -p " + dirName, 
    function (error, stdout, stderr) {
      if (error) {
        console.error(stderr); // send to response?
        return res.send(200, stderr);
        process.exit(1);
      } else {
        console.log(stdout);
        //return res.send(200, stdout); 
        // create java file with |contents|
        console.log('heres contents:');
        console.log(contents);
        exec("echo $'" + contents + "' > " + dirName + '/' + fileName, function(error, stdout, stderr) {
          if (error) {
            console.error(stderr);
            return res.send(200, stderr);
            process.exit(1);
          } else {
            console.log(stdout);
            console.log('file created successfully');
            compileJavaFile("/Users/anna/Google\ Drive/Grad\ Studies/thesis/its110/" + dirName + '/' + fileName, res);
          }
        });
      }
    });
}

//var contents = 'public class MyNewFile {\n\tpublic static void main(String args[]) {\n\t\tSystem.out.println("This is a JAVA program, BUILT AND running on arkys machine!!!");\n\t}\n}';
//createJavaFile("MyNewFile.java", "MyNewFile", contents);
//compileJavaFile("/Users/anna/Google\ Drive/Grad\ Studies/thesis/its110/UserCodeAttempts.java", "UserCodeAttempts");



function handleError(res, err) {
  return res.send(500, err);
}