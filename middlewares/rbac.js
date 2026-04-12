const rbac = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(403).json({ message: 'Access denied. No role assigned.' });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: `Access denied. ${req.user.role} role is not allowed.` });
        }

        next();
    };
};

module.exports = rbac;
