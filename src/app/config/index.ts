import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  port: process.env.PORT,
  database_uri: process.env.DATABASE_URI,
  BCRYPT_SALT_ROUNDS: process.env.BCRYPT_SALT_ROUNDS,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  store_id: process.env.STORE_ID,
  store_password: process.env.STORE_PASSWORD || process.env.STORE_PASS,
  is_live: process.env.IS_LIVE === 'true',
  ssl_payment_api: process.env.SSL_PAYMENT_API,
  ssl_validation_api: process.env.SSL_VALIDATION_API,
  client_base_url: process.env.CLIENT_BASE_URL,
  backend_base_url: process.env.BACKEND_BASE_URL,
};
