
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

##### Notes
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

In particular, the lines of code that are term-dependent are:
```
// ***** Change these next two variables as needed for the current term *****
const currentAPSC160Sections = ["101", "102", "VE1", "VE2"];
const currentAPSC160Session = "2018W";
```

```currentAPSC160Sections``` should be an array of strings, each representing a section of APSC 160 offered in the current term. Change them as needed for the current term.
- You can check which sections are offered [at this UBC courses page](https://courses.students.ubc.ca/cs/courseschedule?pname=subjarea&tname=subj-course&dept=APSC&course=160).
  - Make sure you're looking at the right UBC session (e.g. ```2018 Winter```), which you can toggle in the top right corner.
  - Make sure you only add ```Lecture``` sections (check under the ```Activity``` column).
  - Make sure you only add sections for the correct term (check under the ```Term``` column).
  - Make sure you only add the 3-character section: e.g. ```"101"``` for APSC 160 101.

```currentAPSC160Session``` should be a string representing the current UBC session. Change it as needed for the current term, e.g. ```"2018W"``` for the 2018 Winter session, or ```"2019S"``` for the 2019 Summer session.

**Once you've changed those two lines of code as needed, make sure that you ```commit``` and ```push``` these changes to the ```master``` branch on GitHub, and then re-build and re-start the project as described earlier in this documentation.**

If you're new to this stuff (e.g. GitHub), just follow these steps:
- SSH into the VM: ```ssh comped@comped.cs.ubc.ca```
- ```cd /home/comped/BitFit```
- ```git branch``` to see what GitHub branch you're currently on; you should be on ```master```
  - If you're not yet on ```master```: use ```git checkout master``` to switch to it
- ```vim server/auth/cwl/passport.js``` (this will take you into the ```vim``` editing program, note that it doesn't work like your usual text editor)
  - Scroll down and/or use arrow keys to navigate the text cursor to the lines you need to change (the lines in question should be around 20 lines into the file)
  - Press ```i``` to enter Insert mode
  - Use the arrow keys to navigate your cursor, and type to change the two lines of code as needed
  - Press ```Escape``` to exit Insert mode
  - Type in ```:wq``` and press ```Enter``` to save your changes and exit ```vim```
- ```git status``` to double-check that ```server/auth/cwl/passport.js``` is the only file you've made changes to
  - There shouldn't be any others, other than maybe ```yarn.lock``` or ```package-lock.json``` from running ```yarn install``` or ```npm install```
- ```git diff``` to double-check the changes you're about to commit to GitHub
  - If you made a mistake while editing, use ```git checkout .``` to discard all your changes and start over, or just fix your changes directly in ```vim``` again.
  - If your changes take up the whole screen somehow (unlikely unless more than those two above lines were changed), you may need to press ```q``` to exit ```git diff```
- ```git add -A``` to ready all the files listed by ```git status``` to be committed to GitHub
- ```git commit -m "Update current session and list of current APSC 160 sections"``` to commit your changes with a descriptive message
- ```git push``` to push your commit to GitHub
- Then re-build and re-start (in that order) the project as described under _Start up the comped server_ above.
  - If the server is already up after re-building, take it down and then start it up again to re-start it.




### Give TAs access to BitFit

From Michael Sanderson:

> It should be sufficient for an instructor to send a request to help@cs.ubc.ca with a request that either Anthony Winstanley or Michael Sanderson populate cn=instructors,ou=comped.cs.ubc.ca,ou=Applications,ou=CPSC-UBCV,OU=CLIENTS,dc=id,dc=ubc,dc=ca and cn=teaching-assistants,ou=comped.cs.ubc.ca,ou=Applications,ou=CPSC-UBCV,OU=CLIENTS,dc=id,dc=ubc,dc=ca for the next term.  Ideally the request will include CWL ids for teaching-assistants and instructors, but we have ways to dig them up ourselves (or we’ll ask).  Given some time, this is something that might magically become automated.




### Archive past data

Lots of database objects are stored each term, particularly in the ```users``` and ```loggers``` collections, and this can make some rendering on the website extremely slow. To avoid this, archive data at the end of each term by executing the ```/home/comped/BitFit/archive-users-and-loggers``` script:
- ```ssh comped@comped.cs.ubc.ca```
- ```cd /home/comped/BitFit```
- ```./archive-users-and-loggers <session>```, where ```<session>``` should be replaced by whichever session you're archiving data for
  - E.g. ```./archive-users-and-loggers 2018W1``` to archive the users and loggers from 2018 Winter Term 1.
- Double-check that CSV archive files named ```loggers.csv``` and ```users.csv``` were created in ```/home/comped/archive/<session>``` as desired: ```ls /home/comped/archive/<session>```
- ```./drop-users-and-loggers``` to remove all users and loggers from the database
  - This **CANNOT** be undone so use with caution


That should be all! :)
