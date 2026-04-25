// Controller for handling 404 Page Not Found errors
exports.get404 = (req, res, next) => {
  res.status(404).render('404', { 
    pageTitle: 'Page Not Found', 
    path: '/404',
    isAuthenticated: req.session.isLoggedIn
  });
};

// This controller explicitly handles 500 errors and renders the 500.ejs fallback view.
exports.get500 = (req, res, next) => {
  res.status(500).render('500', {
    pageTitle: 'Error!',
    path: '/500',
    isAuthenticated: req.session.isLoggedIn
  });
};