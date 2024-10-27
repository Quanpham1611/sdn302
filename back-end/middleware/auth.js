const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

    if (!token) {
        return res.status(403).json({ message: "No token provided." });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.log("JWT Verification Error:", err); // Log the error for debugging
            return res.status(401).json({ message: "Unauthorized!" });
        }
        console.log("Decoded JWT:", decoded); // Log the decoded JWT payload
        req.userId = decoded.id;
        next();
    });
};

module.exports = { verifyToken };
