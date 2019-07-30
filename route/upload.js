const express = require('express');
const multer = require('multer');
const path  = require('path');

const router = express.Router();
const storage = multer.diskStorage({
  filename: function (req, file, cb){
    cb(null, file.originalname);
  },
  destination: function(req, file, cb){
    cb(null,'uploads');
  },
})
const upload = multer({storage});
router.use(express.static('../public'));

router.get('/', (req, res) => {
  res.sendFile(path.resolve('public/html/take_file.html'));
})
router.post('/', upload.single("file-to-upload"), (req, res) =>{
  console.log(req.file);
  res.send('AAA');
})

module.exports = router;
