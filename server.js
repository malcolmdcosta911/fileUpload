const express = require('express');
const app = express();
const multer = require('multer');
const cors = require('cors');

//uploads  -- NOTICED IN THIS FOLDER IT DOESNT NOT  KNOW IF SAME FILE UPLOADED again  -- so  replace needed in database and remove old file from folder

app.use(cors());


//use nodemon server.js

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

//multer({  dest: 'uploads/' })  -- creates if doesnt exist  unlike 'storage'
// const upload = multer({  storage })

// app.post('/uploadd',
//  upload.fields([
//     { name: 'Uploadfiles', maxCount: 1 },
//     { name: 'gallery', maxCount: 2 }
//   ])
//   , function (req, res, next) {
//   // req.file is the `avatar` file
//   // req.body will hold the text fields, if there were any
//   console.log(req)
// });


//or
//below method allows your own custom error checking

const upload = multer({ storage }).fields([
  { name: 'Uploadfiles', maxCount: 1 },
  { name: 'gallery', maxCount: 2 }
]);
//.array('Uploadfiles');  -- MUTIPLE FILES
//.single('Uploadfiles');  --SINGLE FILE

app.post('/uploadd', function (req, res) {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err)
    } else if (err) {
      return res.status(500).json(err)
    }
    return res.status(200).send(req.file)

  })
})



app.listen(8000, function () { console.log('running on port 8000'); });





