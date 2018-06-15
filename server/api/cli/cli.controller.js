// @flow
const Dockerode = require('simple-dockerode')

import type { $Request, $Response } from "express";

import { exec as execSync } from "child_process";
import jsesc from "jsesc";
import Logger from "../logger/logger.model";
import { promisify } from "util";

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

const ubuntuContainerName = "ubuuuuuntuContaiiiiiner";

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

const ubuntuContainer = createAndStartUbuntuContainer(ubuntuContainerName);

function runCommandWithinUbuntuContainer(cmd) {
  let execHasTimedOut = false;
  let execHasCompleted = false;
  let result = null;
  let timeLimitInSeconds = 2;
  let timeLimitInMilliseconds = timeLimitInSeconds * 1000;
  return ubuntuContainer.then(container => {

    return new Promise((resolve, reject) => {
      let timeoutFunction = setTimeout(() => {
        execHasTimedOut = true;
        console.log(`${timeLimitInSeconds} seconds have passed`);
        container.kill().then(container => {
          console.log("We killed the container");
          // TODO: remove container
        }).catch(err => {
          console.log("error killing the container");
        });
        if (!execHasCompleted) {
          console.log("Timed out!!!");
          resolve({
            stdout: null,
            stderr: null,
            execWasSuccessful: false,
            errorMsg: `Timeout: exec took longer than ${timeLimitInSeconds} seconds`
          });
        }
      }, timeLimitInMilliseconds);

      container.exec(cmd, {stdout: true, stderr: true}, (err, results) => {
        execHasCompleted = true;
        if (err) {
          console.log("Error running command: ", err);
        } else {
          console.log("Command successfully run.");
          console.log("stdout: ", results.stdout);
          console.log("stderr: ", results.stderr);
        }
        if (!execHasTimedOut) {
          console.log("We did it!!!");
          resolve({
            stdout: results.stdout,
            stderr: results.stderr,
            execWasSuccessful: true,
            errorMsg: null
          });
          // TODO: kill and remove container
          clearTimeout(timeoutFunction);
        }
      });
    })
  }, err => {
    console.log("No ubuntu container available to run the command!");
    console.log("Error received: ", err);
    return Promise.reject({
      stdout: null,
      stderr: null,
      execWasSuccessful: false,
      errorMsg: "No container available"
    });
  });
}

function myTest() {
  let cmd = ['echo', 'Hi'];
  runCommandWithinUbuntuContainer(cmd).then(result => {
    console.log("Now result is: ", result);
  }).catch(err => {
    console.log("Error: ", err);
  });
}

myTest();

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
