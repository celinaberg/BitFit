# Setup / Takedown / Update Instructions

Between terms, one or more tasks will need to be performed:

- Take down the comped server
- Start up the comped server
- Update the code for which sections are offered in the current/upcoming term
- Give TAs access to BitFit
- Archive past data

### Take down the comped server

- ssh into the comped VM: ```ssh comped@comped.cs.ubc.ca```
- cd into the BitFit directory: ```cd /home/comped/BitFit```
- check if comped is currently running: ```pm2 list```
  - If there is an entry with *App name* "BitFit" and *status* "online", then comped is running.
    - To take the server down: ```pm2 stop BitFit``` (or, shorthand, ```pm2 stop 0``` if the *id* is "0")
    - To remove the entry from the list once the server is down: ```pm2 delete BitFit``` (or, shorthand, ```pm2 delete 0``` if the *id* is 0)
  - If there is an entry with *App name* "BitFit" and *status* "stopped", comped is not running.
    - To remove the entry: ```pm2 delete BitFit``` (or, shorthand, ```pm2 delete 0``` if the "BitFit" entry has *id* "0")
  - If there is no entry, there is nothing to do.

### Start up the comped server

- ssh into the comped VM: ```ssh comped@comped.cs.ubc.ca```
- cd into the BitFit directory: ```cd /home/comped/BitFit```
- check if comped is currently running: ```pm2 list```
  - If there is an entry with *App name* “BitFit” and *status* “online”, then comped is already running and there is nothing to do. Unless you want to take down the server (instructions above) and start it up again with new code (instructions below).
  - If there is an entry with *App name* "BitFit" and *status* "stopped", then comped is not running.
    - To start the server: ```pm2 start BitFit``` (or, shorthand, ```pm2 start 0``` if the "BitFit" entry has *id* "0")
  - If there is no entry:
    - To start the server: ```pm2 start ecosystem.config.js```

##### Pitfalls
- If you want to start up the server with new code changes, the project will need to be re-built before the changes will take effect:
    - ```ssh comped@comped.cs.ubc.ca```
    - ```cd /home/comped/BitFit```
    - ```npm run build```
    - ```cd /home/comped/BitFit/client```
    - ```npm run build```
    - Then start up the server as described above.
- If any errors occur when building the project or starting up the server, it may be due to missing Node packages in ```/home/comped/BitFit``` or ```/home/comped/BitFit/client```.
  - To install packages in ```/home/comped/BitFit```:
    - ```cd /home/comped/BitFit```
    - ```npm install``` or ```yarn install``` (or both)
    - ```cd /home/comped/BitFit/client```
    - ```npm install``` or ```yarn install``` (or both)


### Update the BitFit code for the current term

File ```/home/comped/BitFit/server/auth/cwl/passport.js``` contains code to allow/disallow students to access BitFit, depending on whether or not they are registered in a valid current section of APSC 160.
