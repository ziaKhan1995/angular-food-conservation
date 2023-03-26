var express = require('express');
const fileUpload = require('express-fileupload');
var app = express();

const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const _ = require('lodash');
const multer = require('multer');

// enable files upload
// app.use(fileUpload({
//   createParentPath: true
// }));

// app.use(multer({dest:'D:\\akbar\\readingmine\\uploads'}));

app.use(bodyParser.urlencoded({extended: true}));

//add other middleware
app.use(cors());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: true}));
// app.use(morgan('dev'));

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(3004, function () {
  console.log('Listening on port 3004!');
});


