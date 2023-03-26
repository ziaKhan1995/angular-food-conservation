# Rest Api Node and Mysql

## Note: Please look at this new tempalate that uses nest, and graphql. It is much more up to date as I do not use this template anymore
https://github.com/brianschardt/node_nest_graphql_template

## Description
This is an Restful API for Node.js and Mysql. Designed after PHP's beautiful Laravel. This is in the MVC format,
except because it is an API there are no views, just models and controllers.

tutorial can be found here: https://medium.com/@brianalois/build-a-rest-api-for-node-mysql-2018-jwt-6957bcfc7ac9
##### Routing         : Express
##### ORM Database    : Sequelize
##### Authentication  : Passport, JWT

## Installation

#### Download Code | Clone the Repo

```
git clone {repo_name}
```

#### Install Node Modules
```
npm install
if error  mask
npm install ngx-mask@8.2.0

```

project path:
your_project_path



STEPS to generate new Table Nodejs code:
open eclipse shortcuts open eclipse-jee mars

1: goto file ApplicationCodeGen.java 
2: add table name  
like at line 102
listTablesNamesForEntities.add("Users");

3: right click in ApplicationCodeGen.java and run as java application

4: goto fcwrservice see the controller , model generated and routes updated

======================================================================

#### Create .env File
You will find a example.env file in the home directory. Paste the contents of that into a file named .env in the same directory. 
Fill in the variables to fit your application

npm start

relaodable start command ************************************

nodemon /bin/www

11127010945
24925343474

cleint for this 
https://github.com/brianschardt/ng-client

new version

https://github.com/brianschardt/node_nest_graphql_template/tree/master/src

swagger
http://127.0.0.1:3004/v1/docs/
see in documentation
http://127.0.0.1:3004/v1/docs/api.json



url should be like 
http://127.0.0.1:3004/v1/users


url
http://127.0.0.1:3004/v1/users

request
{
	"email":"akbar@gmail1.com",
	"password":"123"
}

response
{
    "message": "Successfully created new user.",
    "user": {
        "id": 3,
        "email": "akbar@gmail1.com",
        "password": "$2b$10$1nwn8SyaNmqioa7pGbcdNuQ0r.LaD/W1Fk8tFQX.jw21q2TVeVD8e",
        "updatedAt": "2020-04-29T14:56:34.466Z",
        "createdAt": "2020-04-29T14:56:34.466Z"
    },
    "token": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjozLCJpYXQiOjE1ODgxNzIxOTQsImV4cCI6MTU4ODE4MjE5NH0.3Ocl0IeyJvv2xA_1ILJOnPGklljJZZuB2HSPZPBKDng",
    "success": true
}


http://127.0.0.1:3004/v1/users/login

{
	"email":"akbar@gmail1.com",
	"password":"123"
}

{
    "token": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjozLCJpYXQiOjE1ODgxNzIzMjIsImV4cCI6MTU4ODE4MjMyMn0.mZIEHIlefpRQwh_CLNmO7yRRhiqknqkkSVi8MMVTjCM",
    "user": {
        "id": 3,
        "first": null,
        "last": null,
        "email": "akbar@gmail1.com",
        "phone": null,
        "password": "$2b$10$1nwn8SyaNmqioa7pGbcdNuQ0r.LaD/W1Fk8tFQX.jw21q2TVeVD8e",
        "createdAt": "2020-04-29T14:56:34.000Z",
        "updatedAt": "2020-04-29T14:56:34.000Z"
    },
    "success": true
}

*************************running production*************************

create zip file
bposservice.zip
on server run commandunzip
unzip bposservice.zip

change db settings in .env


JWT_ENCRYPTION=123456vvv
JWT_EXPIRATION=1000000
SUPER_ADMIN_ROLEID = 1;

UPLOADS_PATH=your_uploads_path

settings in v1.js
callback(null, 'your_uploads_path');

do db related changes in confix.js , .env not working
sudo bash
e

pm2 start www --name your_sevice



delete the modules


rm -rf node_modules/
npm install --unsafe-perm
pm2 logs bposservice

to check errors
do npm start



***********************************

http://127.0.0.1:3004/v1/users

for data cruid 
orm sequalizer


******************issue urdu cherecters not showing as Ø¬Ø§ÙˆØ§-Ø§Ø±Ø¯Ùˆ-

installed npm install utf8



For protected routes by authorization we use JWT. Each of these have a lock by them. Must include a Bearer Token in the header
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ…

fileuploading help

https://attacomsian.com/blog/uploading-files-nodejs-express
https://github.com/expressjs/multer



