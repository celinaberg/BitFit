// @flow

/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

import User from "../api/user/user.model";
import Question from "../api/question/question.model";
import Lesson from "../api/lesson/lesson.model";
import Logger from "../api/logger/logger.model";

export const testLoggerMsgToBePrinted = "Hello this is a test";

export function seedTestData() {
  let usersPromise = new Promise((resolve, reject) => {
    User.find({}).remove(function() {
      console.log("Finished removing users");
      User.create({
          uid: "buser",
          firstName: "Backdoor",
          lastName: "User",
          displayName: "Backdoor User",
          role: "instructor"
        },
        function() {
          console.log("Finished adding users");
          resolve();
        }
      );
    });
  });

  let lessonsPromise = new Promise((resolve, reject) => {
    Lesson.find({}).remove(function() {
      console.log("Finished removing lessons");
      Lesson.create({
          title: "Screencast III",
          background: "Variables are containers for storing many different types of information."
        }, {
          title: "Screencast IV",
          background: "Methods are collections of statements that are executed in sequence, between curly braces."
        },
        function() {
          console.log("Finished adding lessons");
          resolve();
        }
      );
    });
  });

  let questionsPromise = new Promise((resolve, reject) => {
    Question.find({}).remove(function() {
      console.log("Finished removing questions");
      Question.create({
          title: "1 to 10",
          instructions: "New, w1q1 from MongoDB!! Add code to the code editor to make the system output numbers 1 through 10.",
          code: "for (int i = 0; i < 10; i ++) {\n\n}",
          hints: ["first hint", "second hint", "third hint! Do you get it now?"]
        }, {
          title: "Looping",
          instructions: "New, w1q2 from MongoDB!! Add code to the code editor to create a valid for loop.",
          code: 'for (int i = 0; ; i ++) {\n\tSystem.out.println("Hello world!");\n}',
          hints: [
            "first hint correct for loop",
            "second hint",
            "third hint! Do you get it now?"
          ]
        }, {
          title: "Lots of text",
          instructions: "New, w1q3 from MongoDB!! lots of text here and lots more text and more and more and more and more whoooooohoooohooo..... Add code to the code editor to create a valid for loop.",
          code: 'for (int i = 0; ; i ++) {\n\tSystem.out.println("Hello world!");\n}',
          hints: [
            "first hint correct for loop",
            "second hint",
            "third hint! Do you get it now?"
          ]
        }, {
          title: "Units",
          // code : "",
          expectedOutput: "1036200 kg",
          hints: ["Don't forget to output the units!"],
          instructions: "<p>Write a program that takes the length, width and height of a solid steel rectangular bar (in metres).&#160; The program must then compute the mass of the bar in kilograms assuming that the density of the steel is 7850 kg per cubic metre.&#160; Recall that:&#160; mass = density x volume. To check your answer, try length = 6, width = 2, height = 11<br></p>"
        }, {
          title: "Area",
          className: "area",
          code: '/*\n * Author: Pat Gear\n * Student #: 12345678\n * Lab section: L1B\n * Date: January 12, 2008\n * Purpose: ...\n */\n\n#include <stdio.h>\n#include <stdlib.h>\n\nint main( void ) {\n  double area1;\n  double area2;\n\n  //printf( "Enter area in acres: " );\n  //scanf( "%lf", &area1 );\n  area1 = 0; // "user input" of area in acres\n\n  area2 = area1 / 4046.85642;\n\n  printf( "Area in square metres: %f\\n", area2 );\n\n  system( "PAUSE" );\n  return 0;\n}',
          expectedOutput: "Area in square metres: 202342.821000",
          // hints : [],
          instructions: "<p>Suppose that in an APSC 160 lab, students were asked to write a program that:<br>&#160;&#160;&#160; - prompts the user for the area of a plot of land in acres (CAN'T DO IN BITFIT)<br>&#160;&#160;&#160; - prints the area of the same plot of land in square metres<br>Assume that 1 acre is equivalent to 4046.85642 square metres.&#160; One student, Pat, submitted the given code. The program compiles and runs, but does not produce the right output.</p><p>Fix the code. To check your answer, try a &#34;user input&#34; of 50 acres.<br></p>"
        }, {
          title: "Convert Weight",
          className: "convertweight",
          code: '/*\n * Author: Ein Freund\n * Date: July 20, 2009\n * Purpose:  prompts user for a weight in kilograms and converts it to pounds.\n */\n\n#include <stdio.h>\n#include <stdlib.h>\n\n#define LBS_PER_KG 2.2\n\nint main( void ) {\n    double weightKgs;\n    double weightLbs;\n\n    weightLbs = LBS_PER_KG * weightKgs;\n\n   // printf( "Please enter a weight in kilograms: " );\n    weightKgs = 10;\n   // scanf( "%lf", &weightKgs );\n\n    printf( "Corresponding weight in lbs: %f\\n", weightLbs );\n\n    system( "PAUSE" );\n    return 0;\n    \n}',
          // expectedOutput : "",
          // hints : [],
          instructions: "Suppose that you've been asked to write a program that prompts the user for a weight in kilograms and that prints the corresponding weight in pounds on the screen.&#160; We assume a conversion rate of 2.2 pounds to the kilogram.&#160; Let's assume that a friend of yours has written the given program.<br>The program compiles and runs but, unfortunately, it doesn't produce the correct output. <br>Identify the problem. Then figure out how you would explain to your friend why the program doesn't work and what needs to be done to fix it."
        },
        function() {
          console.log("Finished adding questions");
          resolve();
        }
      );
    });
  });

  let loggersPromise = new Promise((resolve, reject) => {
    Logger.find({}).remove(function() {
      console.log("Finished removing loggers");
      Logger.create(
        {
          className: "GoodCode",
          code: `#include <stdio.h>\nint main()\n{\n\tprintf("${testLoggerMsgToBePrinted}");\n\treturn 0;\n}`
        },
        {
          className: "BadCode",
          code: "this is invalid C code"
        },
        function() {
          console.log("Finished adding loggers");
          resolve();
        }
      );
    });
  });

  return Promise.all([usersPromise, lessonsPromise, questionsPromise, loggersPromise]);

}
