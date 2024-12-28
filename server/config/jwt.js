import dotenv from "dotenv";

dotenv.config();

var jwtConfig={
    jwtSecret: process.env.JWT_SECRET || 'defaultSecretKey',
    jwtExpiresIn: '1h'
}

export {jwtConfig};