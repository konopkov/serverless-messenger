export interface EnvVariables extends NodeJS.ProcessEnv {
    STAGE?: 'dev' | 'stage' | 'prod';
    DEBUG?: 'true';
    SES_REGION: string;
    SNS_REGION: string;
}
