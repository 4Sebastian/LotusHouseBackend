const jwt = require('jsonwebtoken');
const secret = "" + process.env.JWT_SECRET;

exports.authCheck = async function(req, res, next) {
    const bearerHeader = req.headers['authorization'];

    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const token = bearer[1]; 
        //const token = req.headers.authorization;
        
        await jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                res.send(401);
                console.log(token);
                console.log(err);

            }
            else {
                //req.body.uses = decoded.uses;
                next();
            }
        });
    }
    else {
        res.send(401);
    }
}