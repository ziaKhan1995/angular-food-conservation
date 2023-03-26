require('dotenv').config();//instatiate environment variables

let CONFIG = {} //Make this global to use all over the application

CONFIG.app = process.env.APP || 'dev';
CONFIG.port = process.env.PORT || '3004';

CONFIG.db_dialect = process.env.DB_DIALECT || 'mysql';
CONFIG.db_host = process.env.DB_HOST || 'localhost';
CONFIG.db_port = process.env.DB_PORT || '3306';
CONFIG.db_name = process.env.DB_NAME || 'dbname';
CONFIG.db_user = process.env.DB_USER || 'username';
CONFIG.db_password = process.env.DB_PASSWORD || '1111';

CONFIG.jwt_encryption = process.env.JWT_ENCRYPTION || 'secret';
CONFIG.jwt_expiration = process.env.JWT_EXPIRATION || '1000000';

CONFIG.super_admin_roleId = process.env.super_admin_roleId || 1;

CONFIG.UPLOADS_PATH =your_uploads_path;

CONFIG.APPLICATION_ID = 3;
CONFIG.DEFAULT_DATE_fROMAT = 'yyyy-MM-dd HH:mm:ss';
module.exports = CONFIG;
