const jwt = require('jsonwebtoken');
const config = require('config');

let verifyToken = (req, res, next) => {
    let token = req.get('Authorization');
    jwt.verify(token, config.get('configToken.SEED'), (err, decoded) => {
        if (err) {
            return res.status(401).json({
                err
            });
        }
        req.user = decoded.data;
        next()
    });
}

module.exports = verifyToken;