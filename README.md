BitFit
========

An app designed to help students learn to write and read C code.

BitFit is forked from Modsquad-AVA/BitFit, which was designed to help students learn Java.

BitFit was built using the [Yeoman](http://yeoman.io/) generator for [AngularJS](https://angularjs.org/). 

Features
--------
- Student version of web app
  - Questions where students can write and run real C code
- Admin section of web app
  - Create/modify learning Topics
  - Create/delete/modify Questions, with hints and starter code
  - View and manage list of users
  - Explore logged data of student usage through a parallel coordinates graph

Getting it Running
------------
### Requirements
* BitFit has only been run successfully on Ubuntu 14.04 and Ubuntu 16.04. Run on other platforms at your own risk.
* [NodeJS]() and [MongoDB]() must be installed prior to running BitFit.

### Install
* Git clone this repository
* `cd BitFit`
* Install the dependencies

    ```
    sudo npm install
    bower install
    ```
    
* Create a server/config/local.env.js file AND a server/config/seed.js file

### Run Locally
* Get the MongoDB up and running following their [instructions](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/)
* `grunt serve`

### Run for Production
I recommend using [PM2](http://pm2.keymetrics.io/) to run BitFit. It's easy and has a lot of cool features.
* To install: 

  ```
  sudo su
  npm install pm2 -g
  ```
* To run BitFit:

  ```
  sudo su
  pm2 start server/app.js --name BitFit
  ```
  
* To start/stop/restart:

  ```
  sudo su
  pm2 start BitFit
  pm2 stop BitFit
  pm2 restart BitFit
  ```
  
