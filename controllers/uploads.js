const path = require('path')
const fs = require('fs')

const cloudinary = require('cloudinary').v2
cloudinary.config( process.env.CLOUDINARY_URL )

const { response } = require('express');
const { uploadFile } = require('../helpers');
const { User, Product } = require('../models');

const loadFile = async (req, res = response) => {

  try {
    // const nameFileUploaded = await uploadFile( req.files, ['txt', 'md'], 'textFiles' )
    const nameFileUploaded = await uploadFile(req.files, undefined, 'images');

    res.json({ nameFileUploaded });
  } catch (error) {
    res.status(400).json({ msg: error });
  }
};

// PARA ALMACENAR LAS IMAGENES EN EL SERVIDOR 
// const updateFile = async (req, res = response) => {
//   const { collection, id } = req.params;

//   let model;

//   switch (collection) {
//     case 'users':
//       model = await User.findById(id);

//       if (!model) {
//         return res.status(404).json({
//           msg: `User with id ${id} does not exist`,
//         });
//       }
//       break;

//     case 'products':
//       model = await Product.findById(id);

//       if (!model) {
//         return res.status(404).json({
//           msg: `Product with id ${id} does not exist`,
//         });
//       }
//       break;

//     default:
//       return res
//         .status(500)
//         .json({ msg: 'This endpoint is not working currently' });
//   }

//   try {

//     // Limpiar imagenes previas
//     if ( model.img ) {
//       const pathImage = path.join( __dirname, '../uploads/', collection, model.img )

//       if ( fs.existsSync( pathImage ) ) {
//         fs.unlinkSync( pathImage )
//       }
        
//     }

//     const nameFileUploaded = await uploadFile(req.files, undefined, collection);
//     model.img = nameFileUploaded;
//     await model.save();
//     res.json(model);

//   } catch (error) {
//     res.status(400).json({ msg: error });
//   }
// };

const updateFileCloudinary = async (req, res = response) => {
  const { collection, id } = req.params;

  let model;

  switch (collection) {
    case 'users':
      model = await User.findById(id);

      if (!model) {
        return res.status(404).json({
          msg: `User with id ${id} does not exist`,
        });
      }
      break;

    case 'products':
      model = await Product.findById(id);

      if (!model) {
        return res.status(404).json({
          msg: `Product with id ${id} does not exist`,
        });
      }
      break;

    default:
      return res
        .status(500)
        .json({ msg: 'This endpoint is not working currently' });
  }

  try {

    // Limpiar imagenes previas
    if ( model.img ) {
      const nameArr = model.img.split('/')
      const nameId = nameArr[ nameArr.length - 1 ]
      const [ publicID ] = nameId.split('.')
      await cloudinary.uploader.destroy( publicID )
    }

    const { tempFilePath } = req.files.myFile
    const { secure_url } = await cloudinary.uploader.upload( tempFilePath )
    model.img = secure_url
    await model.save()
    res.status(200).json(model);

  } catch (error) {
    res.status(400).json({ msg: error });
  }
};

const showImage = async ( req, res = response ) => {
  
  const { collection, id } = req.params;

  let model;

  switch (collection) {
    case 'users':
      model = await User.findById(id);

      if (!model) {
        return res.status(404).json({
          msg: `User with id ${id} does not exist`,
        });
      }
      break;

    case 'products':
      model = await Product.findById(id);

      if (!model) {
        return res.status(404).json({
          msg: `Product with id ${id} does not exist`,
        });
      }
      break;

    default:
      return res
        .status(500)
        .json({ msg: 'This endpoint is not working currently' });
  }

 
  if ( model.img ) {
    const pathImage = path.join( __dirname, '../uploads/', collection, model.img )

    if ( fs.existsSync( pathImage ) ) {
      return res.sendFile( pathImage )
    } 
  }

  const pathImageDefault = path.join( __dirname, '../assets/no-image.jpg')

  return res.sendFile( pathImageDefault )

}


module.exports = {
  loadFile,
  // updateFile,
  showImage,
  updateFileCloudinary
};
