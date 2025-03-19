const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.login = async (req, res, next) => {
    const { email, password, phone } = req.body;
    if (!password || !(email || phone)) {
        return res.json({
            status: 400,
            message: "Missing email or password",
        });
    }
    
    try {
        const user = await prisma.user.findUnique({
            where: { email: email },
          });
        if (!user) {
            return res.json({
                status: 404,
                message: "User is not found",
            });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.json({ status: 401,message: "Incorrect password"});
        }
        const token = jwt.sign(
            {
                id: user._id,
                admin: user.admin,
            },
            process.env.JWT_SECRET,
            { expiresIn: "365d" }
        );

        return res.json({
            status: 200,
            message: "Login successful",
            token: token,
        });
    } catch (error) {
        console.error(error);
        return res.json({ status: 500, message: error.message});
    }
};
