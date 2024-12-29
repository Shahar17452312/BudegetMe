import dotenv from "dotenv";

dotenv.config();

var jwtConfig={
    jwtSecret: process.env.JWT_SECRET || 'defaultSecretKey',
    jwtAccessTokenExpiresIn: '1h',
    jwtRefreshTokenExpiresIn: '7d'
}

export {jwtConfig};