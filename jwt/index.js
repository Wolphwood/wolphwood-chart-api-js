const { Manager } = require('../app');
const jwt = require('jsonwebtoken');
const { jwt_cipher: CIPHER_TOKEN } = require('../config');


async function JWTLogin(req, res, next) {
    let token = req.headers.authorization ?? req.body.authorization;

    let isValidAuthToken = await Manager.user.check_token({ token });

    if (!isValidAuthToken) {
        return res.status(401).json({ error: "Identifiant invalides." });
    }

    res.status(200).json({
        token: jwt.sign(
            { token: req.body.token },
            CIPHER_TOKEN,
            { expiresIn: '24h' }
        )
    });
}

async function JWTAuth(req, res, next) {
    try {
        const token = req.headers.authorization ?? req.body.authorization;

        const decodedToken = jwt.verify(token, CIPHER_TOKEN);

        const userId = decodedToken.userId;
        
        req.auth = {
            userId: userId
        };
        
        next();
    } catch(error) {
        res.status(401).json({ ...error });
    }
}







module.exports = {
    login: JWTLogin,
    authentication: JWTAuth,
}