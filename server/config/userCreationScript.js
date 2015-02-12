
// input is a text file of usernames, one per line
// create a user object for each user

var fs = require('fs');
var source = fs.createReadStream('../../users/usersNew.txt');

var text = "User.find({}).remove(function() { \n\tUser.create("

source.on('readable', function() {
  var user; 
  // while there are lines in the file
  while(chunk = source.read()) {
    console.log(typeof(chunk));
    var data = chunk.toString() 
    console.log(data);
    var lines = data.split('\n')  
    lines.forEach(function(ea) {
      //ea.replace(/\n/g, '');
      //ea.replace(/\r/g, '');
      //console.log(ea);
      //console.log(typeof(ea));
      text += "{\n\t\tprovider: 'local',\n\t\tname: '" + ea + "',\n\t\temail: '" + ea + "@uvic.ca',\n\t\tpassword: 'csc110Practice'\n\t},"
    }); 
    // create a new user 
  }

  text += ", function() {\n\t\t\tconsole.log('finished populating users');\n\t\t}\n\t);\n});";

  fs.writeFile("userCreationCode.js", text, function(err) {
    if(err) {
      console.log(err);
    } else {
      console.log("made the file!");
    }
  });
});



// fs.readFile("/tmp/test", "Hey there!", function(err) {
//     if(err) {
//         console.log(err);
//     } else {
//         console.log("The file was saved!");
//     }
// }); 


// users.forEach(function(ea) {
//   text += "{\n\t\tprovider: 'local',\n\t\tname: '" + ea + "',\n\t\temail: '" + ea + "@uvic.ca',\n\t\tpassword: 'csc110Practice'\n\t},"
// });


/*
User.find({}).remove(function() {
  User.create({
    provider: 'local',
    name: 'Test User',
    email: 'test@test.com',
    password: 'test'
  }, {
    provider: 'local',
    role: 'admin',
    name: 'Admin',
    email: 'admin@admin.com',
    password: 'admin1999'
  }, function() {
      console.log('finished populating users');
    }
  );
});
*/