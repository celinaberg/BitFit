const exec = require('child_process').exec
const jsesc = require('jsesc')
const Docker = require('dockerode')

// Compile java code
exports.compile = function (req, res) {
  const fileName = req.body.fileName
  let dirName = `users/${req.body.user._id}/`
  const dateTime = new Date()
  dirName += dateTime.getMonth()
  dirName += dateTime.getDate()
  dirName += dateTime.getFullYear()

  // make a directory for this user, if doesn't exist already
  exec(`mkdir -p ${dirName}`, { timeout: 10000 }, // Process will time out if running for > 10 seconds.
    (error, stdout, stderr) => {
      if (error) {
        return res.status(200).send(stderr)
      }

      const escapedCode = jsesc(req.body.code, {
        wrap: true
      })
      exec(`echo ${escapedCode} > ${dirName}/${fileName}`, { timeout: 10000 }, // Process will time out if running for > 10 seconds.
          (error, stdout, stderr) => {
            if (error) {
              return res.status(200).send(stderr)
            }
            compileJavaFile(`${dirName}/${fileName}`, dirName, res)
          })
    })
}

// run java code
exports.run = function (req, res) {
  let dirName = `users/${req.body.user._id}/`
  const dateTime = new Date()
  dirName += dateTime.getMonth()
  dirName += dateTime.getDate()
  dirName += dateTime.getFullYear()
  const execFile = req.body.fileName.replace('.c', '')
  const cmd = `"${dirName}/${execFile}"`
  var docker = new Docker({
	  host: 'localhost',
	  port: process.env.DOCKER_PORT || 4343,
	  ca: fs.readFileSync('C:/Users/Tiara/Documents/BitFit/server/cert/ca.pem'),
	  cert: fs.readFileSync('C:/Users/Tiara/Documents/BitFit/server/cert/cert.pem'),
	  key: fs.readFileSync('C:/Users/Tiara/Documents/BitFit/server/cert/key.pem'),
	  version: 'v1.30' // required when Docker >= v1.13, https://docs.docker.com/engine/api/version-history/
  }); 
  exec(cmd, { timeout: 10000 }, // Process will time out if running for > 10 seconds.
    (error, stdout, stderr) => {
      if (error) {
        return res.status(200).send(error)
      }
      if (error !== null) {
      }
      return res.status(200).send(stdout)
    })
}

function compileJavaFile (srcFile, dirName, res) {
  const execFile = srcFile.replace('.c', '')
  // exec is asynchronous
  exec(`gcc "${srcFile}" -o "${execFile}"`, { timeout: 10000 }, // Process will time out if running for > 10 seconds.
    (error, stdout, stderr) => {
      if (error) {
        return res.status(200).send(stderr)
      }
      return res.send(stdout)
    })
}
