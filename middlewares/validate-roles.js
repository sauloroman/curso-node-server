const { response } = require("express")

const isAdminRole = ( req, res = response, next ) => {
  
  if ( !req.user ) {
    return res.status(500).json({
      msg: "You cannot check use's role without validate token firstly"
    })
  }

  const { role, username } = req.user

  if ( role !== 'ADMIN_ROLE') {
    return res.status(401).json({
      msg: `User ${ username } is not administrator. You cannot do this`
    })
  }

  next()

}

const hasRole = ( ...roles ) => {

  return ( req, res = response, next ) => {
    
    if ( !req.user ) {
      return res.status(500).json({
        msg: "You cannot check use's role without validate token firstly"
      })
    }

    if ( !roles.includes( req.user.role ) ) {
      return res.status(401).json({
        msg: `Service requires one of these roles ${roles}`
      })
    } 

    next()
  }

}

module.exports = {
  isAdminRole,
  hasRole
}