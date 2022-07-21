export interface EnvVariables extends NodeJS.ProcessEnv {
    STAGE?: 'dev' | 'stage' | 'prod';
    DEBUG?: 'true';
    LOGGING_LEVEL?: 'string';
    SES_REGION?: string;
    SNS_REGION?: string;
}
