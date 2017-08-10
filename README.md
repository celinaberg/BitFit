# BitFit
[![dependencies Status](https://david-dm.org/celinaberg/BitFit/status.svg)](https://david-dm.org/celinaberg/BitFit)
[![devDependencies Status](https://david-dm.org/celinaberg/BitFit/dev-status.svg)](https://david-dm.org/celinaberg/BitFit?type=dev)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

An app designed to help students learn to write and read C code.

## Features
- Student version of web app
  - Questions where students can write and run real C code
- Admin section of web app
  - Create/modify learning Topics
  - Create/delete/modify Questions, with hints and starter code
  - View and manage list of users
  - Explore logged data of student usage through a parallel coordinates graph

## Development Environment

Install [nodemon](https://github.com/remy/nodemon) globally with `npm install -g nodemon`.

Install local dependencies with `npm install`.

In two terminal windows run the following commands:
  - `npm run build-watch` to have webpack watch and build the app
  - `npm run start` to have nodemon restart the server when there are changes
 
Currently there is no live reload in the browser. So, you will need to refresh yourself or submit a pull request to add this feature.

## Run for Production
I recommend using [PM2](http://pm2.keymetrics.io/) to run BitFit. It's easy and has a lot of cool features.
 -  To install: 

  ```
  sudo su
  npm install pm2 -g
  ```
 - To run BitFit:

  ```
  sudo su
  pm2 start ecosystem.config.js
  ```
  
 - To start/stop/restart:

  ```
  sudo su
  pm2 start BitFit
  pm2 stop BitFit
  pm2 restart BitFit
  ```

# Dependencies
 - Node 8
 - npm 5
