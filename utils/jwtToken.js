import jwt from 'jsonwebtoken';

export const generateToken = (user, message, statusCode, res) => {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES,
    });

    res.status(statusCode).cookie("adminToken", token, {
        httpOnly: true,
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000), // Example expiration: 15 days
    }).json({
        success: true,
        message,
        token,
    });
};