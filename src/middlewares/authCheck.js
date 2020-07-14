const jwt = require('jsonwebtoken');
const secret = "" + process.env.JWT_SECRET;

exports.authCheck = async function(req, res, next) {
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(' ')[1];
        //const token = req.headers.authorization;
        
        await jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                res.send(401);
                console.log(token);
                console.log(err);

            }
            else {
                next();
            }
        });
    }
    else {
        res.send(401);
    }
}