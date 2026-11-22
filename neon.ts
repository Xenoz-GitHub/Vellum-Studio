import { Neon } from '@neon/serverless';
import type { NeonConfig } from '@neon/serverless/config';

export const config: NeonConfig = {
  postgres: {
    connectionString: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_XqcIN7fL3dxA@ep-solitary-butterfly-bdmhkkvn-pooler.c-8.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
  },
  auth: {
    url: process.env.NEON_AUTH_URL || 'https://ep-solitary-butterfly-bdmhkkvn.neonauth.c-8.us-east-2.aws.neon.tech/neondb/auth',
  },
};
