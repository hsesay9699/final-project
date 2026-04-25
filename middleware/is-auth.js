// This middleware protects routes from unauthenticated users.
// If a user is not logged in, it redirects them to the login page.
// If they are logged in, it calls next() to allow the request to continue.

module.exports = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect('/login');
    }
    next();
};