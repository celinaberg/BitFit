// @flow
const Dockerode = require('simple-dockerode');

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
  return container.inspect().then(
    data => {
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
    },
    err => {
      let errMsg = "Error inspecting container: " + err;
      console.log(errMsg);
      return Promise.reject(errMsg);
    });
}

/** Creates, starts, and returns an ubuntu Docker container, or starts and returns the existing one if it already exists.
*/
function createAndStartUbuntuContainer(containerName) {
  return docker.createContainer({
    Image: 'gcc',
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

const execTimeLimitInSeconds = 10;
const timeoutErrorMsg = `Timeout: code took longer than ${execTimeLimitInSeconds} seconds to run`;

function runCommandWithinContainer(cmd, container) {
  const execTimeLimitInMilliseconds = execTimeLimitInSeconds * 1000;

  let execPromise = container.exec(cmd, {
    stdout: true,
    stderr: true
  });

  return timeout(execPromise, execTimeLimitInMilliseconds).then(
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
        execError: err
      }
    });
}

function myTest2() {
  let testContainerName = "testContainer";
  createAndStartUbuntuContainer(testContainerName).then(
    container => {
      let dirName = "users/testUserId/testLoggerId";
      return runCommandWithinContainer(['mkdir', '-p', dirName], container).then(
        result => {
          let testCCode = `#include <stdio.h>\nint main()\n{\n\tprintf("Hello world :)");\n\treturn 0;\n}`;
          console.log(testCCode);
          testCCode = jsesc(testCCode, {
            wrap: true
          });
          console.log("testCCode: ");
          console.log(testCCode);
          let testLoggerClassName = "testLoggerClassName";
          let testCFileName = `${dirName}/${testLoggerClassName}.c`;
          let testCFileOutputName = `${dirName}/${testLoggerClassName}`;
          return runCommandWithinContainer(['bash', '-c', `echo -en ${testCCode} > ${testCFileName}`], container).then(
            result => {
              return runCommandWithinContainer(['bash', '-c', `gcc "${testCFileName}" -o "${testCFileOutputName}" -lm`], container).then(
                result => {
                  return runCommandWithinContainer(['bash', '-c', `./${testCFileOutputName}`], container).then(result => {
                    console.log("Here's our result: ", result);
                    container.kill().then(container => {
                      console.log("Container killed");
                      container.remove().then(_ => {
                        console.log("Container removed");
                      });
                    });
                  });
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

function getUserDockerContainerName(userId, loggerId) {
  return userId + "_" + loggerId;
}

function getDirName(userId, loggerId) {
  return "users/" + userId + "/" + loggerId;
}

function getCodeFilePath(dirName, logger) {
  return `${dirName}/${logger.className}.c`;
}

function getOutputFilePath(dirName, logger) {
  return `${dirName}/${logger.className}`;
}

function errResult(err) {
  return {
    stdout: null,
    stderr: null,
    execWasSuccessful: false,
    execError: err
  };
}

export async function compileLogger(req: $Request, res: $Response) {
  const userId = req.user.id;
  const loggerId = req.params.id;
  const logger = await Logger.findById(loggerId);
  if (!logger) {
    return res.status(400).json({
      error: `No logger found;`
    });
  }
  //console.log(logger);

  const userDockerContainerName = getUserDockerContainerName(userId, loggerId);
  const result = await createAndStartUbuntuContainer(userDockerContainerName).then(
    container => {
      const dirName = getDirName(userId, loggerId);
      const mkdirCmd = ['mkdir', '-p', dirName];
      return runCommandWithinContainer(mkdirCmd, container).then(
        result => {
          const escapedCode = jsesc(logger.code, {
            wrap: true
          });
          const codeFilePath = getCodeFilePath(dirName, logger);
          const outputFilePath = getOutputFilePath(dirName, logger);
          const echoCmd = ['bash', '-c', `echo -en ${escapedCode} > ${codeFilePath}`];
          return runCommandWithinContainer(echoCmd, container).then(
            result => {
              const gccCmd = ['bash', '-c', `gcc "${codeFilePath}" -o "${outputFilePath}" -lm`];
              return runCommandWithinContainer(gccCmd, container).then(
                result => {
                  return result;
                },
                err => {
                  return errResult(err);
                }
              );
            },
            err => {
              return errResult(err);
            }
          );
        },
        err => {
          return errResult(err);
        }
      );
    },
    err => {
      return errResult(err);
    }
  );

  if (result.execWasSuccessful) {
    return res
      .status(200)
      .json({
        error: false,
        stdout: result.stdout,
        stderr: result.stderr
      });
  } else {
    if (result.execError instanceof TimeoutError) {
      return res
        .status(200)
        .json({
          error: true,
          stdout: result.stdout,
          stderr: timeoutErrorMsg
        });
    } else {
      return res
        .status(400)
        .json({
          error: result.execError
        });
    }
  }
}

export async function runLogger(req: $Request, res: $Response) {
  const userId = req.user.id;
  const loggerId = req.params.id;
  const logger = await Logger.findById(loggerId);
  if (!logger) {
    return res.status(400).json({
      error: `No logger found;`
    });
  }

  const userDockerContainerName = getUserDockerContainerName(userId, loggerId);

  const container = docker.getContainer(userDockerContainerName);

  const dirName = getDirName(userId, loggerId);
  const outputFilePath = getOutputFilePath(dirName, logger);
  const runCmd = ['bash', '-c', `${outputFilePath}`];
  const result = await runCommandWithinContainer(runCmd, container).then(
    result => {
      return result;
    },
    err => {
      return errResult(err);
    }
  );

  if (result.execWasSuccessful) {
    return res
      .status(200)
      .json({
        error: false,
        stdout: result.stdout,
        stderr: result.stderr
      });
  } else {
    if (result.execError instanceof TimeoutError) {
      return res
        .status(200)
        .json({
          error: true,
          stdout: result.stdout,
          stderr: timeoutErrorMsg
        });
    } else {
      return res
        .status(400)
        .json({
          error: result.execError
        });
    }
  }
}
