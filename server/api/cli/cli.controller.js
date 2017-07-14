

const exec = require('child_process').exec;
const jsesc = require('jsesc');

function handleError(res, err) {
  return res.send(500, err);
}

// Compile java code
exports.compile = function (req, res) {
  const fileName = req.body.fileName;
  let dirName = `users/${req.body.user._id}/`;
  const dateTime = new Date();
  dirName += dateTime.getMonth();
  dirName += dateTime.getDate();
  dirName += dateTime.getFullYear();

  // make a directory for this user, if doesn't exist already
  exec(`mkdir -p ${dirName}`, { timeout: 10000 }, // Process will time out if running for > 10 seconds.
    (error, stdout, stderr) => {
      if (error) {
        return res.send(200, stderr);
      }

      const escapedCode = jsesc(req.body.code, {
        wrap: true,
      });
      exec(`echo ${escapedCode} > ${dirName}/${fileName}`, { timeout: 10000 }, // Process will time out if running for > 10 seconds.
          (error, stdout, stderr) => {
            if (error) {
              return res.send(200, stderr);
            }
            compileJavaFile(`${dirName}/${fileName}`, dirName, res);
          });
    });
};

// run java code
exports.run = function (req, res) {
  let dirName = `users/${req.body.user._id}/`;
  const dateTime = new Date();
  dirName += dateTime.getMonth();
  dirName += dateTime.getDate();
  dirName += dateTime.getFullYear();
  const execFile = req.body.fileName.replace('.c', '');
  const cmd = `"${dirName}/${execFile}"`;
  const cp = exec(cmd, { timeout: 10000 }, // Process will time out if running for > 10 seconds.
    (error, stdout, stderr) => {
      if (error) {
        return res.send(200, error);
      }
      if (error !== null) {
      }
      return res.send(200, stdout);
    });
};


function compileJavaFile(srcFile, dirName, res) {
  const execFile = srcFile.replace('.c', '');
  // exec is asynchronous
  exec(`gcc "${srcFile}" -o "${execFile}"`, { timeout: 10000 }, // Process will time out if running for > 10 seconds.
    (error, stdout, stderr) => {
      if (error) {
        return res.send(200, stderr);
      }
      return res.send(stdout);
    });
}

function run_cmd(cmd, args, callBack) {
  const spawn = require('child_process').spawn;
  const child = spawn(cmd, args);
  let resp = '';

  child.stdout.on('data', (buffer) => { resp += buffer.toString(); });
  child.stdout.on('end', () => { callBack(resp); });
}

// contents should be an html string with newline characters
function createCompileJavaFile(dirName, fileName, className, contents, res) {
  // make a directory for this user, if doesn't exist already
  exec(`mkdir -p ${dirName}`, { timeout: 10000 }, // Process will time out if running for > 10 seconds.
    (error, stdout, stderr) => {
      if (error) {
        return res.send(200, stderr);
      }
        // create java file with |contents|
      exec(`echo $'${contents}' > ${dirName}/${fileName}`, { timeout: 10000 }, // Process will time out if running for > 10 seconds.
          (error, stdout, stderr) => {
            if (error) {
              return res.send(200, stderr);
            }
            compileJavaFile(`${dirName}/${fileName}`, dirName, res);
          });
    });
}
