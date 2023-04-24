const { response } = require("express");

const validateFile = ( req, res = response, next ) => {

  if (!req.files || Object.keys(req.files).length === 0 || !req.files.myFile) {
    return res.status(400).json({ msg: 'No files to upload.' });
  }

  next()

}

module.exports = {
  validateFile
}