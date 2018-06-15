// @flow
const Dockerode = require('simple-dockerode')

import type { $Request, $Response } from "express";

import { exec as execSync } from "child_process";
import jsesc from "jsesc";
import Logger from "../logger/logger.model";
import { promisify } from "util";
import { timeout, TimeoutError } from "promise-timeout";

const exec = promisify(execSync);

// Compile java code
// export function compile(req: $Request, res: $Response) {
//   const fileName = req.body.fileName;
//   let dirName = `users/${req.body.user._id}/`;
//   const dateTime = new Date();
//   dirName += dateTime.getMonth();
//   dirName += dateTime.getDate();
//   dirName += dateTime.getFullYear();
//
//   // make a directory for this user, if doesn't exist already
//   exec(
//     `mkdir -p ${dirName}`,
//     { timeout: 10000 }, // Process will time out if running for > 10 seconds.
//     (error, stdout, stderr) => {
//       if (error) {
//         return res.status(200).send(stderr);
//       }
//
//       const escapedCode = jsesc(req.body.code, {
//         wrap: true
//       });
//       exec(
//         `echo ${escapedCode} > ${dirName}/${fileName}`,
//         { timeout: 10000 }, // Process will time out if running for > 10 seconds.
//         (error, stdout, stderr) => {
//           if (error) {
//             return res.status(200).send(stderr);
//           }
//           compileJavaFile(`${dirName}/${fileName}`, dirName, res);
//         }
//       );
//     }
//   );
// }
//
// // run java code
// export function run(req: $Request, res: $Response) {
//   let dirName = `users/${req.body.user._id}/`;
//   const dateTime = new Date();
//   dirName += dateTime.getMonth();
//   dirName += dateTime.getDate();
//   dirName += dateTime.getFullYear();
//   const execFile = req.body.fileName.replace(".c", "");
//   const cmd = `"${dirName}/${execFile}"`;
//   exec(
//     cmd,
//     { timeout: 10000 }, // Process will time out if running for > 10 seconds.
//     (error, stdout, stderr) => {
//       if (error) {
//         return res.status(200).send(error);
//       }
//       return res.status(200).send({ stdout, stderr });
//     }
//   );
// }
//
// function compileJavaFile(srcFile, dirName, res) {
//   const execFile = srcFile.replace(".c", "");
//   // exec is asynchronous
//   exec(
//     `gcc "${srcFile}" -o "${execFile}"`,
//     { timeout: 10000 }, // Process will time out if running for > 10 seconds.
//     (error, stdout, stderr) => {
//       if (error) {
//         return res.status(200).send(stderr);
//       }
//       return res.send(stdout);
//     }
//   );
// }

const docker = new Dockerode();

/** Starts `container` if it is not already running, then returns it.
*/
function startUbuntuContainerIfNecessary(container) {
  return container.inspect().then(data => {
    if (data.State.Running) {
      console.log("Container is already started, returning it now");
      return container;
    } else {
      return container.start().then(container => {
        console.log("Successful start, returning the container");
        return container;
      }).catch(err => {
        let errMsg = "Failed start: " + err;
        console.log(errMsg);
        return Promise.reject(errMsg);
      });
    }
  }).catch(err => {
    let errMsg = "Error inspecting container: " + err;
    console.log(errMsg);
    return Promise.reject(errMsg);
  });
}

/** Creates, starts, and returns an ubuntu Docker container, or starts and returns the existing one if it already exists.
*/
function createAndStartUbuntuContainer(containerName) {
  return docker.createContainer({
    Image: 'ubuntu',
    AttachStdin: false,
    AttachStdout: true,
    AttachStderr: true,
    Cmd: ['bash', '-c', 'touch a; tail -f a'],
    name: containerName
  }).then(container => {
    console.log("Successful creation, starting and returning the container now");
    return startUbuntuContainerIfNecessary(container);
  }).catch(err => {
    if (err.json.message.includes(`Conflict. The container name "/${containerName}" is already in use`)) {
      console.log(`Container ${containerName} already exists, starting and returning it now`);
      let container = docker.getContainer(containerName);
      return startUbuntuContainerIfNecessary(container);
    } else {
      let errMsg = "Failed creation: " + err;
      console.log(errMsg);
      return Promise.reject(errMsg);
    }
  });
}

function killAndRemoveContainer(container) {
  container.kill().then(
    container => {
      console.log("Successful kill, removing the container now");
      container.remove().then(
        data => {
          console.log("Successfully removed container");
        },
        err => {
          console.log("Error removing container: ", err);
        });
    },
    err => {
      console.log("Error killing container: ", err);
    });
}

function runCommandWithinContainer(cmd, container) {
  let timeLimitInSeconds = 10;
  let timeLimitInMilliseconds = timeLimitInSeconds * 1000;

  let execPromise = container.exec(cmd, {
    stdout: true,
    stderr: true
  });

  return timeout(execPromise, timeLimitInMilliseconds).then(
    results => {
      return {
        stdout: results.stdout,
        stderr: results.stderr,
        execWasSuccessful: true,
        execError: null
      };
    },
    err => {
      return {
        stdout: null,
        stderr: null,
        execWasSuccessful: false,
        execError: (err instanceof TimeoutError) ? `Timeout error: exec took longer than ${timeLimitInSeconds} seconds` : err
      }
    });
}

function myTest() {
  let cmd = ['echo', 'Hi'];
  let ubuntuContainerName = "ubuuuuuntuContaiiiiiner";
  createAndStartUbuntuContainer(ubuntuContainerName).then(
    ubuntuContainer => {
      runCommandWithinContainer(cmd, ubuntuContainer).then(result => {
        console.log("Now result is: ", result);
        killAndRemoveContainer(ubuntuContainer);
      }).catch(err => {
        console.log("Error: ", err);
        killAndRemoveContainer(ubuntuContainer);
      });
    },
    err => {
      console.log("No ubuntu container available to run the command!");
      console.log("Error received: ", err);
    });
}

myTest();

function myTest2() {
  let testContainerName = "testContainer";
  createAndStartUbuntuContainer(testContainerName).then(
    container => {
      let dirName = "users/testUserId/testLoggerId";
      return runCommandWithinContainer(['mkdir', '-p', dirName], container).then(
        result => {
          let testCCode = "this is not actual code";
          let testLoggerClassName = "testLoggerClassName";
          let testCFileName = `${dirName}/${testLoggerClassName}.c`;
          return runCommandWithinContainer(['bash', '-c', `echo ${testCCode} > ${testCFileName}`], container).then(
            result => {
              return runCommandWithinContainer(['bash', '-c', `cat ${testCFileName}`], container).then(
                result => {
                  console.log("Here's our result: ", result);
                }
              ).catch(
                err => {
                  console.log("Error running stuff: ", err);
                }
              );
            }
          );
        }
      ).catch(err => {
        console.log("THere was an error runing stuff: ", err);
      });
    },
    err => {
      console.log(`No container available to run code within due to error ${err}`);
    }
  );
}

myTest2();

export async function compileLogger(req: $Request, res: $Response) {
  try {
    const userId = req.user.id;
    const loggerId = req.params.id;
    const logger = await Logger.findById(loggerId);
    if (!logger) {
      return res.status(400).json({
        error: `No logger found;`
      });
    }
    //console.log(logger);
    const dirName = "users/" + userId + "/" + loggerId;
    await exec("mkdir -p " + dirName);
    const escapedCode = jsesc(logger.code, {
      wrap: true
    });
    await exec(`echo ${escapedCode} > ${dirName}/${logger.className}.c`);
    const gcc = `gcc "${dirName}/${logger.className}.c" -o "${dirName}/${logger.className}" -lm`;
    //console.log(gcc);
    const result = await exec(gcc, {
      timeout: 10000
    });
    //console.error("result object", result);
    return res
      .status(200)
      .json({ error: false, stdout: result.stdout, stderr: result.stderr });
  } catch (err) {
    //console.error(err);
    return res
      .status(200)
      .json({ error: true, stdout: err.stdout, stderr: err.stderr });
  }
}

export async function runLogger(req: $Request, res: $Response) {
  try {
    const userId = req.user.id;
    const loggerId = req.params.id;
    const logger = await Logger.findById(loggerId);
    if (!logger) {
      return res.status(400).json({
        error: `No logger found;`
      });
    }
    const dirName = "users/" + userId + "/" + loggerId;
    const cmd = `"${dirName}/${logger.className}"`;
    const result = await exec(cmd, { timeout: 10000 });
    return res
      .status(200)
      .json({ error: false, stdout: result.stdout, stderr: result.stderr });
  } catch (err) {
    return res
      .status(200)
      .json({ error: true, stdout: err.stdout, stderr: err.stderr });
  }
}
