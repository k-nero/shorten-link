const jwt = require("jsonwebtoken");

const verifyToken = (token) =>
{
    return new Promise((res, rej) =>
    {
        jwt.verify(token, process.env.JWT_SECRET, function(err, user)
        {
            if(err)
            {
                return rej();
            }
            return res(user);
        });
    });
};

const authenticate = async (req, res, next) =>
{
    if(!req.headers.authorization)
    {
         res.status(400).send({message: "Authorization token was not provided"});
         return;
    }
    if(!req.headers.authorization.startsWith("Bearer "))
    {
         res.status(400).send({message: "Authorization token was not provided or was not valid"});
         return;
    }
    const token = req.headers.authorization.split(" ")[1];
    let user;
    try
    {
        user = await verifyToken(token);
    }
    catch(err)
    {
         res.status(400).send({message: "Authorization token was not provided or was not valid"});
         return
    }
    req.user = user.user;
    next();
};

module.exports = authenticate;
