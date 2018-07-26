// @flow

import type { $Request, $Response } from "express";

import { exec as execSync } from "child_process";
import jsesc from "jsesc";
import Logger from "../logger/logger.model";
import { promisify } from "util";
import { timeout, TimeoutError } from 'promise-timeout';

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

// In production, run student executables securely as comped-exec
export const runExecutablesAsCompedExecUser = process.env.USER === "comped";

if (runExecutablesAsCompedExecUser) {
  console.log("Running executables securely as comped-exec user");
} else {
  console.log("Running executables non-securely");
}

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
    // console.error(err);
    return res
      .status(200)
      .json({ error: true, stdout: err.stdout, stderr: err.stderr });
  }
}

export async function runLogger(req: $Request, res: $Response) {
  const timeLimitInSeconds = 20;
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
    const cmd = (runExecutablesAsCompedExecUser ?
      `sudo -u comped-exec "${dirName}/${logger.className}"` :
      `"${dirName}/${logger.className}"`
    );
    const result = await timeout(exec(cmd, { timeout: timeLimitInSeconds * 1000 }), 1.5 * timeLimitInSeconds * 1000);
    return res
      .status(200)
      .json({ error: false, stdout: result.stdout, stderr: result.stderr });
  } catch (err) {
    let stderr = err.stderr;
    if (err.signal === "SIGTERM") {
      stderr = `TimeoutError: file took longer than ${timeLimitInSeconds} seconds to run`;
    } else if (err instanceof TimeoutError) {
      stderr = `Error running executable: attempt took longer than ${1.5 * timeLimitInSeconds} seconds to run`;
    }
    return res
      .status(200)
      .json({ error: true, stdout: err.stdout || "", stderr: stderr });
  }
}
