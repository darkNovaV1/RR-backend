const requireAuth = (req, res, next) => {
    req.session.redirectTo = req.originalUrl;
    if (!req.session.user) {
        res.redirect('/login');
    } else {
        next();
    }
};

module.exports = requireAuth;