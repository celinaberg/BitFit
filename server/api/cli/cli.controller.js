// @flow

import type { $Request, $Response } from "express";

import { exec } from "child-process-promise";
import jsesc from "jsesc";
import Logger from "../logger/logger.model";

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
    console.log(logger);
    const dirName = "users/" + userId + "/" + loggerId;
    await exec("mkdir -p " + dirName);
    const escapedCode = jsesc(logger.code, {
      wrap: true
    });
    await exec(`echo ${escapedCode} > ${dirName}/${logger.className}.c`);
    const result = await exec(
      `gcc "${dirName}/${logger.className}.c" -o "${logger.className}"`,
      {
        timeout: 10000
      }
    );
    return res
      .status(200)
      .json({ error: false, stdout: result.stdout, stderr: result.stderr });
  } catch (err) {
    console.error(err);
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
      .json({ error: true, stdout: result.stdout, stderr: result.stderr });
  } catch (err) {
    return res
      .status(200)
      .json({ error: true, stdout: err.stdout, stderr: err.stderr });
  }
}
