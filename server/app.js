/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var mongoose = require('mongoose');
var config = require('./config/environment');

// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);

// Populate DB with sample data
if(config.seedDB) { require('./config/seed'); }

// Setup server
var app = express();
var server = require('http').createServer(app);
var socketio = require('socket.io')(server, {
  serveClient: (config.env === 'production') ? false : true,
  path: '/socket.io-client'
});
require('./config/socketio')(socketio);
require('./config/express')(app);
require('./routes')(app);

// Start server
server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

function run_cmd(cmd, args, callBack ) {
    var spawn = require('child_process').spawn;
    var child = spawn(cmd, args);
    var resp = "";

    child.stdout.on('data', function (buffer) { resp += buffer.toString() });
    child.stdout.on('end', function() { callBack (resp) });
} // ()
/*
run_cmd( "ls", ["-l"], function(text) { 
	console.log (text); 
});

run_cmd( "javac", [ '/Users/anna/Google Drive/Grad Studies/thesis/its110/UserCodeAttempts.java'], function(output) {
	console.log('seems i compiled a java file? heres the output: ');
	console.log(output);
	run_cmd("java", [ '/Users/anna/Google Drive/Grad Studies/thesis/its110/UserCodeAttempts'], function(output2) {
		console.log('seems i ran a java file??');
		console.log(output2);
	});
});
*/

var exec = require('child_process').exec;
 

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

function compileJavaFile(srcFile, className) {
  // exec is asynchronous
  exec('javac "'+ srcFile + '"',
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
}

// contents should be an html string with newline characters
function createJavaFile(fileName, className, contents) {
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
	exec("echo $'" + contents + "' > " + fileName, function(error, stdout, stderr) {
		if (error) {
			console.error(stderr);
			process.exit(1);
		} else {
			console.log(stdout);
			console.log('file created successfully');
			compileJavaFile("/Users/anna/Google\ Drive/Grad\ Studies/thesis/its110/" + fileName, className);
		}
	})
}

//var contents = 'public class MyNewFile {\n\tpublic static void main(String args[]) {\n\t\tSystem.out.println("This is a JAVA program, BUILT AND running on arkys machine!!!");\n\t}\n}';
//createJavaFile("MyNewFile.java", "MyNewFile", contents);
//compileJavaFile("/Users/anna/Google\ Drive/Grad\ Studies/thesis/its110/UserCodeAttempts.java", "UserCodeAttempts");


// Expose app
exports = module.exports = app;