const authorize = (alloweRoleId) => {
    return (req, res, next) => {
        const { roleId } = req.user;

        if (roleId !== parseInt(alloweRoleId)) {
            return res.status(403).send('Access denied.');
        }
        next();
    };
};

module.exports = authorize;


