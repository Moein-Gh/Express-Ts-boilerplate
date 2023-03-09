import { cleanEnv, str, port } from 'envalid';
function validateEnv(): void {
  cleanEnv(process.env, {
    NODE_ENV: str({ choices: ['development', 'production'] }),
    MONGO_PATH: str(),
    MONGO_NAME: str(),
    PORT: port(),
    JWT_SECRET: str(),
  });
}

export default validateEnv;
