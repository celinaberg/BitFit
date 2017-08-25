// @flow

import { exec } from "child_process";
import jsesc from "jsesc";

// Compile java code
export function compile(req, res) {
  const fileName = req.body.fileName;
  let dirName = `users/${req.body.user._id}/`;
  const dateTime = new Date();
  dirName += dateTime.getMonth();
  dirName += dateTime.getDate();
  dirName += dateTime.getFullYear();

  // make a directory for this user, if doesn't exist already
  exec(
    `mkdir -p ${dirName}`,
    { timeout: 10000 }, // Process will time out if running for > 10 seconds.
    (error, stdout, stderr) => {
      if (error) {
        return res.status(200).send(stderr);
      }

      const escapedCode = jsesc(req.body.code, {
        wrap: true
      });
      exec(
        `echo ${escapedCode} > ${dirName}/${fileName}`,
        { timeout: 10000 }, // Process will time out if running for > 10 seconds.
        (error, stdout, stderr) => {
          if (error) {
            return res.status(200).send(stderr);
          }
          compileJavaFile(`${dirName}/${fileName}`, dirName, res);
        }
      );
    }
  );
}

// run java code
export function run(req, res) {
  let dirName = `users/${req.body.user._id}/`;
  const dateTime = new Date();
  dirName += dateTime.getMonth();
  dirName += dateTime.getDate();
  dirName += dateTime.getFullYear();
  const execFile = req.body.fileName.replace(".c", "");
  const cmd = `"${dirName}/${execFile}"`;
  exec(
    cmd,
    { timeout: 10000 }, // Process will time out if running for > 10 seconds.
    (error, stdout, stderr) => {
      if (error) {
        return res.status(200).send(error);
      }
      return res.status(200).send({ stdout, stderr });
    }
  );
}

function compileJavaFile(srcFile, dirName, res) {
  const execFile = srcFile.replace(".c", "");
  // exec is asynchronous
  exec(
    `gcc "${srcFile}" -o "${execFile}"`,
    { timeout: 10000 }, // Process will time out if running for > 10 seconds.
    (error, stdout, stderr) => {
      if (error) {
        return res.status(200).send(stderr);
      }
      return res.send(stdout);
    }
  );
}
