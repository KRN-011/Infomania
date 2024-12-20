function addUserToLocals(req, res, next) {
    res.locals.admin = req.user;
    next();
  }
  
  export default addUserToLocals;
  