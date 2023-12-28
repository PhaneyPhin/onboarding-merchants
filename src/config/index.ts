import { OnboardingMerchant } from "src/entities/onboarding-merchant.entity";

export default () => {
    return ({
        documentBucket: process.env.BUCKET_NAME,
        serviceAccountBaseUrl: process.env.SERVICE_ACCOUNT_BASE_URL,
        minio: {
            endPoint: process.env.MINIO_ENDPOINT || 'localhost',
            port: +(process.env.MINIO_PORT || 9000),
            useSSL: process.env.MINIO_USE_SSL === 'true' || false,
            accessKey: process.env.MINIO_ACCESS_KEY as string,
            secretKey: process.env.MINIO_SECRET_KEY as string,
        },
        database: {
            type: 'postgres',
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT || '5432', 10),
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            entities: [OnboardingMerchant],
            synchronize: true,
          },
        ekybUrl: process.env.EKYB_URL,
        ekybRoadClient: process.env.EKYB_CAMDX_CLIENT,
        userAPIUrl: process.env.USER_URL,
        signatureSecrete: process.env.SIGNATURE_SECRETE,
        fileBaseUrl: process.env.FILE_BASE_URL
      });
}