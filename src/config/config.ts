import * as env from 'env-var';

interface iConfig {
  SERVER_ENV: string;
  DATABASE_URL: string;
  JWT_SECRET: string;
}

export enum SERVER_ENV {
  PRODUCTION = 'production',
  STAGING = 'staging',
  LOCAL = 'local',
}

export default (): iConfig => ({
  SERVER_ENV: env
    .get('SERVER_ENV')
    .required()
    .asEnum(Object.values(SERVER_ENV)),
  DATABASE_URL: env.get('DATABASE_URL').required().asString(),
  JWT_SECRET: env.get('JWT_SECRET').required().asString(),
});
