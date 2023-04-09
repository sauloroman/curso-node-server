require('colors')
const mongoose = require('mongoose')

const dbConnection = async() => {

  try {
    
    await mongoose.connect( process.env.MONGODB_CNN, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    console.log('\n*-------------------------------*'.blue)
    console.log('Database connection ready'.blue)
    console.log('*-------------------------------*\n'.blue)

  } catch (error) {
    console.log(error)
    process.exit(1)
  }

}

module.exports = {
  dbConnection
}