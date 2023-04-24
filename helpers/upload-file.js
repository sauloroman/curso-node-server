const path = require('path')
const { v4: uuidv4 } = require('uuid')

const uploadFile = ( files, validExtentions = ['png', 'jpg', 'jpeg', 'gif'], folder = '' ) => {

  return new Promise( ( resolve, reject ) => {

    const { myFile } = files;
    const nameCut = myFile.name.split('.')
    const extention = nameCut[ nameCut.length - 1 ]

    // Validar extensiones
    if ( !validExtentions.includes( extention ) ) {
      return reject(`${extention} file is not allowed. You can upload ${ validExtentions } files`)
    }
    
    const tempName = uuidv4() + '.' + extention
    const uploadPath = path.join( __dirname, '../uploads/', folder, tempName );

    myFile.mv( uploadPath, (err) => {
      if (err) return reject( err )
      resolve( tempName )
    });

  })

}

module.exports = {
  uploadFile
}