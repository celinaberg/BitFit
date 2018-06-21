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
    }).catch(err => {
      const errMsg = `Error starting container: ${err}`;
      console.log(errMsg);
      reject(errMsg);
    }).then(container => {
      console.log("Successful start, returning the container");
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
  return new Promise((resolve, reject) => {
    container.kill().catch(err => {
      const errMsg = `Error killing container: ${err}`;
      console.log(errMsg);
      reject(errMsg);
    }).then(container => {
      console.log("Successful kill, removing the container now");
      return container.remove();
    }).catch(err => {
      const errMsg = `Error removing container: ${err}`;
      console.log(errMsg);
      reject(errMsg);
    }).then(data => {
      const successMsg = "Successfully removed container";
      console.log(successMsg);
      resolve(successMsg);
    });
  });
}

const execTimeLimitInSeconds = 10;
const timeoutErrorMsg = `Timeout: code took longer than ${execTimeLimitInSeconds} seconds to run`;

function errExecResult(err) {
  return {
    stdout: null,
    stderr: null,
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
      return {
        stdout: results.stdout,
        stderr: results.stderr,
        execWasSuccessful: true,
        execError: null
      };
    },
    err => {
      return errExecResult(err);
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
  const execResult = await createAndStartGCCContainer(userDockerContainerName).then(
    container => {
      const dirName = getDirName(userId, loggerId);
      const mkdirCmd = ['mkdir', '-p', dirName];
      return runCommandWithinContainer(mkdirCmd, container).then(
        execResult => {
          const escapedCode = jsesc(logger.code, {
            wrap: true
          });
          const codeFilePath = getCodeFilePath(dirName, logger);
          const outputFilePath = getOutputFilePath(dirName, logger);
          const echoCmd = ['bash', '-c', `echo -en ${escapedCode} > ${codeFilePath}`];
          return runCommandWithinContainer(echoCmd, container).then(
            execResult => {
              const gccCmd = ['bash', '-c', `gcc "${codeFilePath}" -o "${outputFilePath}" -lm`];
              return runCommandWithinContainer(gccCmd, container).then(
                execResult => {
                  return execResult;
                },
                err => {
                  return errExecResult(err);
                }
              );
            },
            err => {
              return errExecResult(err);
            }
          );
        },
        err => {
          return errExecResult(err);
        }
      );
    },
    err => {
      return errExecResult(err);
    }
  );

  if (execResult.execWasSuccessful) {
    return res
      .status(200)
      .json({
        error: false,
        stdout: execResult.stdout,
        stderr: execResult.stderr
      });
  } else {
    if (execResult.execError instanceof TimeoutError) {
      return res
        .status(200)
        .json({
          error: true,
          stdout: execResult.stdout,
          stderr: timeoutErrorMsg
        });
    } else {
      return res
        .status(400)
        .json({
          error: execResult.execError
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
  const execResult = await runCommandWithinContainer(runCmd, container).then(
    execResult => {
      return execResult;
    },
    err => {
      return errExecResult(err);
    }
  );

  await killAndRemoveContainer(container);

  if (execResult.execWasSuccessful) {
    return res
      .status(200)
      .json({
        error: false,
        stdout: execResult.stdout,
        stderr: execResult.stderr
      });
  } else {
    if (execResult.execError instanceof TimeoutError) {
      return res
        .status(200)
        .json({
          error: true,
          stdout: execResult.stdout,
          stderr: timeoutErrorMsg
        });
    } else {
      return res
        .status(400)
        .json({
          error: execResult.execError
        });
    }
  }
}
