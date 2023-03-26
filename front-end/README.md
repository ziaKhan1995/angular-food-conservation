# Food Conservation and Waste reduction

### Angular CLI version 14.2.6.
### Angaular Materials


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

======================================================================

#### Create .env File
You will find a example.env file in the home directory. Paste the contents of that into a file named .env in the same directory. 
Fill in the variables to fit your application

npm start

relaodable start command ************************************
nodemon /bin/www


*************************running production*************************

change db settings in .env

APP=dev
PORT=3004

DB_DIALECT=mysql
DB_HOST=localhost
DB_PORT=3306
DB_NAME=DB_name
DB_USER=DB_username
DB_PASSWORD=DB_PSD

JWT_ENCRYPTION=Your_jwt_code
JWT_EXPIRATION=1000000
SUPER_ADMIN_ROLEID = 1;

UPLOADS_PATH=Uploads_path

settings in v1.js
callback(null, Uploads_path);


****Error: /home/bitpoint/rdm/readingmineService/node_modules/bcrypt/lib/binding/napi-v3/bcrypt_lib.node: invalid ELF header

delete the modules


to check errors
do npm start



***********************************

for data cruid 
orm sequalizer


******************issue urdu cherecters not showing as Ø¬Ø§ÙˆØ§-Ø§Ø±Ø¯Ùˆ-

installed npm install utf8



For protected routes by authorization we use JWT. Each of these have a lock by them. Must include a Bearer Token in the header
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ…

fileuploading help

https://attacomsian.com/blog/uploading-files-nodejs-express
https://github.com/expressjs/multer




## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

# NPM
*Run all the required npm commands. visit pckage.json and run all the npm libraries required NPM commands in order to run the project.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
