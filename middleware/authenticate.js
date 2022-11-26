const jwt = require("jsonwebtoken");

const verifyToken = (token) =>
{
    return new Promise((res, rej) =>
    {
        jwt.verify(token, process.env.JWT_SECRET, function(err, user)
        {
            if(err)
            {
                console.log(err);
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
        return res
            .status(400)
            .send({message: "Authorization token was not provided"});
    }
    if(!req.headers.authorization.startsWith("Bearer "))
    {
        return res.status(400).send({
            message: "Authorization token was not provided or was not valid",
        });
    }
    const token = req.headers.authorization.split(" ")[1];
    let user;
    try
    {
        user = await verifyToken(token);
    }
    catch(err)
    {
        return res.status(400).send({
            message: "Authorization token was not provided or was not valid",
        });
    }
    req.user = user.user;
    next();
};

module.exports = authenticate;
