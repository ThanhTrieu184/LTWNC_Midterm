exports.checkLogin = (req, res, next) => {
  if (req.signedCookies.user) {
    next();
  } else {
    res.redirect(303, "/login");
  }
};
