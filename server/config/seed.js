// /**
//  * Populate DB with sample data on server start
//  * to disable, edit config/environment/index.js, and set `seedDB: false`
//  */

// 'use strict';

// var User = require('../api/user/user.model');
// var Question = require('../api/question/question.model');
// var Topic = require('../api/topic/topic.model');

// User.find({}).remove(function() {
//   User.create({
//     provider: 'local',
//     role: 'admin',
//     name: 'Admin',
//     email: 'admin@admin.com',
//     password: 'admin1999'
//   },
//   {
//     provider: 'local',
//     name: 'test_user_1',
//     email: 'test_user_1@uvic.ca',
//     password: 'csc110Practice'
//   }, function() {
//       console.log('finished populating users');
//     }
//   );
// });

// Topic.find({}).remove(function() {
//   Topic.create(
//     {
//       title: 'Screencast III',
//       background: 'Variables are containers for storing many different types of information.',
//        // questions: [
//        //     // ObjectId("573cc6dea381957b1517fa52"),
//        //     //          ObjectId("573cc6dea381957b1517fa53")
//        //              ]
//     },
//     {
//       title: 'Screencast IV',
//       background: 'Methods are collections of statements that are executed in sequence, between curly braces.',
//       // questions: [
//       //      // ObjectId("5748aece9f2a443a0f14bc88"),
//       //      //        ObjectId("573ce86b127367bc18c867af"),
//       //      //        ObjectId("573cc6dea381957b1517fa51")
//       //             ]
//     }, function() {
//       console.log('finished populating topics!');
//     });
// });

// Question.find({}).remove(function() {
//   Question.create({
//     instructions: "New, w1q1 from MongoDB!! Add code to the code editor to make the system output numbers 1 through 10.",
//     code: "for (int i = 0; i < 10; i ++) {\n\n}",
//     hints: [ "first hint", "second hint", "third hint! Do you get it now?" ]
//   }, {
//     path: '/week1',
//     questionNum: 2,
//     instructions: "New, w1q2 from MongoDB!! Add code to the code editor to create a valid for loop.",
//     code: "for (int i = 0; ; i ++) {\n\tSystem.out.println(\"Hello world!\");\n}",
//     hints: [ "first hint correct for loop", "second hint", "third hint! Do you get it now?" ]
//   }, {
//     path: '/week1',
//     questionNum: 3,
//     instructions: "New, w1q3 from MongoDB!! lots of text here and lots more text and more and more and more and more whoooooohoooohooo..... Add code to the code editor to create a valid for loop.",
//     code: "for (int i = 0; ; i ++) {\n\tSystem.out.println(\"Hello world!\");\n}",
//     hints: [ "first hint correct for loop", "second hint", "third hint! Do you get it now?" ]
//   }, {
//     //code : "",
//     expectedOutput : "1036200 kg",
//     hints : [
//         "Don't forget to output the units!"
//     ],
//     instructions : "<p>Write a program that takes the length, width and height of a solid steel rectangular bar (in metres).&#160; The program must then compute the mass of the bar in kilograms assuming that the density of the steel is 7850 kg per cubic metre.&#160; Recall that:&#160; mass = density x volume. To check your answer, try length = 6, width = 2, height = 11<br></p>",
//   }, {
//   className : "area",
//     code : "/*\n * Author: Pat Gear\n * Student #: 12345678\n * Lab section: L1B\n * Date: January 12, 2008\n * Purpose: ...\n */\n\n#include <stdio.h>\n#include <stdlib.h>\n\nint main( void ) {\n  double area1;\n  double area2;\n\n  //printf( \"Enter area in acres: \" );\n  //scanf( \"%lf\", &area1 );\n  area1 = 0; // \"user input\" of area in acres\n\n  area2 = area1 / 4046.85642;\n\n  printf( \"Area in square metres: %f\\n\", area2 );\n\n  system( \"PAUSE\" );\n  return 0;\n}",
//     expectedOutput : "Area in square metres: 202342.821000",
//     //hints : [],
//     instructions : "<p>Suppose that in an APSC 160 lab, students were asked to write a program that:<br>&#160;&#160;&#160; - prompts the user for the area of a plot of land in acres (CAN'T DO IN BITFIT)<br>&#160;&#160;&#160; - prints the area of the same plot of land in square metres<br>Assume that 1 acre is equivalent to 4046.85642 square metres.&#160; One student, Pat, submitted the given code. The program compiles and runs, but does not produce the right output.</p><p>Fix the code. To check your answer, try a &#34;user input&#34; of 50 acres.<br></p>",
//   },
// {
//   className : "convertweight",
//     code : "/*\n * Author: Ein Freund\n * Date: July 20, 2009\n * Purpose:  prompts user for a weight in kilograms and converts it to pounds.\n */\n\n#include <stdio.h>\n#include <stdlib.h>\n\n#define LBS_PER_KG 2.2\n\nint main( void ) {\n    double weightKgs;\n    double weightLbs;\n\n    weightLbs = LBS_PER_KG * weightKgs;\n\n   // printf( \"Please enter a weight in kilograms: \" );\n    weightKgs = 10;\n   // scanf( \"%lf\", &weightKgs );\n\n    printf( \"Corresponding weight in lbs: %f\\n\", weightLbs );\n\n    system( \"PAUSE\" );\n    return 0;\n    \n}",
//     //expectedOutput : "",
//     //hints : [],
//     instructions : "Suppose that you've been asked to write a program that prompts the user for a weight in kilograms and that prints the corresponding weight in pounds on the screen.&#160; We assume a conversion rate of 2.2 pounds to the kilogram.&#160; Let's assume that a friend of yours has written the given program.<br>The program compiles and runs but, unfortunately, it doesn't produce the correct output. <br>Identify the problem. Then figure out how you would explain to your friend why the program doesn't work and what needs to be done to fix it."
//   },
//   function() {
//       console.log('finished populating questions');
//     }
//   );
// });
