const authorization = async (req, res, next) =>
{
    if(req.user.role !== "admin")
    {
        return res.status(400).send({message: "Permission denied"});
    }
    next();
};

module.exports = authorization;
