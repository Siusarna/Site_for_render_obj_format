const express = require('express');
const multer = require('multer');
const path = require('path');
const render = require('../utils/render/index.js');

const router = express.Router();
const storage = multer.diskStorage({
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  },
  destination: function(req, file, cb) {
    cb(null, 'uploads');
  },
})
const upload = multer({
  storage
});
router.use(express.static('../public'));

router.get('/', (req, res) => {
  res.sendFile(path.resolve('public', 'html', 'take_file.html'));
})
router.post('/', upload.single("file-to-upload"), (req, res) => {
  const fileName = req.file.originalname;
  const options = render.option_parser(req.body);
  const light = render.light_parser(req.body);
  render.startRender(fileName, options, light);
  res.sendFile(path.resolve('public', 'html', 'result.html'));
})

module.exports = router;