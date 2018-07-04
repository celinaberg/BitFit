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

// start out the promise with an already resolved mock call
let callQueuePromise = Promise.resolve();

// returns a promise that ends at `nextCall` regardless of if callQueuePromise has been appended
// in the meantime by another call of `queueFunctionCall`.
function queueFunctionCall(nextCall) {
  callQueuePromise = callQueuePromise.then(nextCall);
  return callQueuePromise;
}

/** Starts `container` if it is not already running, then returns it.
*/
function startUbuntuContainerIfNecessary(container) {
  return new Promise((resolve, reject) => {
    container.inspect().catch(err => {
      let errMsg = "Error inspecting container: " + err;
      console.log(errMsg);
      reject(errMsg);
    }).then(data => {
      if (data.State.Running) {
        console.log("Container is already started, returning it now");
        resolve(container);
      } else {
        return container.start();
      }
    }).catch(async err => {
      let errMsg = `Error starting container: ${err}`;
      console.log(errMsg);
      console.log("Now cleaning up by attempting to remove non-started container");
      await container.remove().then(data => {
        console.log("Container removed successfully");
      }).catch(err => {
        const removeErrMsg = "\nFailed to remove container, there is now a non-started container lying around";
        errMsg += removeErrMsg;
        console.log(removeErrMsg);
      });
      reject(errMsg);
    }).then(container => {
      // console.log("Successful start, returning the container");
      resolve(container);
    });
  });
}

/** Creates, starts, and returns a GCC Docker container with name `containerName`.
Alternatively starts and returns the existing one if it already exists.
*/
function createAndStartGCCContainer(containerName) {
  return docker.createContainer({
    Image: 'gcc',
    AttachStdin: false,
    AttachStdout: true,
    AttachStderr: true,
    Cmd: ['bash', '-c', 'touch a; tail -f a'],
    name: containerName
  }).then(container => {
    // console.log("Successful creation, starting and returning the container now");
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
  return new Promise((resolve, reject) => {
    container.kill().catch(err => {
      const errMsg = `Error killing container: ${err}`;
      console.log(errMsg);
      reject(errMsg);
    }).then(container => {
      // console.log("Successful kill, removing the container now");
      return container.remove();
    }).catch(err => {
      const errMsg = `Error removing container: ${err}`;
      console.log(errMsg);
      reject(errMsg);
    }).then(data => {
      const successMsg = "Successfully removed container";
      // console.log(successMsg);
      resolve(successMsg);
    });
  });
}

const execTimeLimitInSeconds = 10;

function errExecResult(err) {
  return {
    stdout: "",
    stderr: "",
    execWasSuccessful: false,
    execError: err
  };
}

function runCommandWithinContainer(cmd, container) {
  const execTimeLimitInMilliseconds = execTimeLimitInSeconds * 1000;

  let execPromise = container.exec(cmd, {
    stdout: true,
    stderr: true
  });

  return timeout(execPromise, execTimeLimitInMilliseconds).then(
    results => {
      if (results.stderr) {
        throw results.stderr;
      } else {
        return {
          stdout: results.stdout,
          stderr: results.stderr,
          execWasSuccessful: true,
          execError: null
        };
      }
    },
    err => {
      throw err;
    });
}

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

function getResponseBasedOnExecResult(res, execResult) {
  if (execResult.execWasSuccessful) {
    return res
      .status(200)
      .json({
        error: false,
        stdout: execResult.stdout,
        stderr: execResult.stderr
      });
  } else {
    return res
      .status(200)
      .json({
        error: true,
        stdout: execResult.stdout,
        stderr: JSON.stringify(execResult.execError, Object.getOwnPropertyNames(execResult.execError))
      });
  }
}

/** Tries to compile Logger code inside `container`. Returns a Promise for an execResult.
 */
function compileLoggerCodeWithinContainer(dirName, logger, container) {
  return new Promise((resolve, reject) => {
    const codeFilePath = getCodeFilePath(dirName, logger);
    const mkdirCmd = ['mkdir', '-p', dirName];
    runCommandWithinContainer(mkdirCmd, container).then(execResult => {
      const escapedCode = jsesc(logger.code, {
        wrap: true
      });
      const echoCmd = ['bash', '-c', `echo -en ${escapedCode} > ${codeFilePath}`];
      return runCommandWithinContainer(echoCmd, container);
    }).then(execResult => {
      const outputFilePath = getOutputFilePath(dirName, logger);
      const gccCmd = ['bash', '-c', `gcc "${codeFilePath}" -o "${outputFilePath}" -lm`];
      return runCommandWithinContainer(gccCmd, container);
    }).then(execResult => {
      resolve(execResult);
    }).catch(err => {
      reject(err);
    });
  });
}

function compileLoggerCallCreator(req: $Request, res: $Response) {
  return () => {
    return new Promise(async (resolve, reject) => {
      const userId = req.user.id;
      const loggerId = req.params.id;
      const dirName = getDirName(userId, loggerId);
      const logger = await Logger.findById(loggerId);
      if (!logger) {
        reject(res.status(400).json({
          error: `No logger found;`
        }));
      }
      //console.log(logger);

      const userDockerContainerName = getUserDockerContainerName(userId, loggerId);
      const containerPromise = createAndStartGCCContainer(userDockerContainerName);

      const execResult = await containerPromise.then(container => {
        return compileLoggerCodeWithinContainer(dirName, logger, container);
      }).catch(err => {
        return errExecResult(err);
      });

      // Kill and remove container if it was created successfully
      await containerPromise.then(async container => {
        await killAndRemoveContainer(container);
      }).catch(err => {
        // do nothing
      });

      resolve(getResponseBasedOnExecResult(res, execResult));
    });
  };
}

export async function compileLogger(req: $Request, res: $Response) {
  let nextCall = compileLoggerCallCreator(req, res);
  let outputResponse = await queueFunctionCall(nextCall);
  return outputResponse;
}

function runLoggerCallCreator(req: $Request, res: $Response) {
  return () => {
    return new Promise(async (resolve, reject) => {
      const userId = req.user.id;
      const loggerId = req.params.id;
      const dirName = getDirName(userId, loggerId);
      const logger = await Logger.findById(loggerId);
      if (!logger) {
        reject(res.status(400).json({
          error: `No logger found;`
        }));
      }

      const userDockerContainerName = getUserDockerContainerName(userId, loggerId);
      const containerPromise = createAndStartGCCContainer(userDockerContainerName);
      let userContainer;

      const execResult = await containerPromise.then(container => {
        userContainer = container;
        return (compileLoggerCodeWithinContainer(dirName, logger, container));
      }).then(execResult => {
        const outputFilePath = getOutputFilePath(dirName, logger);
        const runCmd = ['bash', '-c', `${outputFilePath}`];
        return runCommandWithinContainer(runCmd, userContainer);
      }).catch(err => {
        return errExecResult(err);
      });

      // Kill and remove container if it was created successfully
      await containerPromise.then(async container => {
        await killAndRemoveContainer(container);
      }).catch(err => {
        console.log("Container creation failed so there's nothing to kill");
        // do nothing
      });

      resolve(getResponseBasedOnExecResult(res, execResult));
    });
  };
}

export async function runLogger(req: $Request, res: $Response) {
  let nextCall = runLoggerCallCreator(req, res);
  let outputResponse = await queueFunctionCall(nextCall);
  return outputResponse;
}
