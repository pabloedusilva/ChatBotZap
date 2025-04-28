// middleware/auth.js
function isAuthenticated(req, res, next) {
    if (req.session && req.session.userId) {
        return next();
    }
    return res.redirect('/login');
}

function isDashboardAuthenticated(req, res, next) {
    if (req.session && req.session.dashboardUserId) {
        return next();
    }
    return res.redirect('/dashboard-login');
}

module.exports = {
    isAuthenticated,
    isDashboardAuthenticated
};