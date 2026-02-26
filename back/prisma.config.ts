import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    // Приоритет: DATABASE_URL > NEON/LOCAL по NODE_ENV
    url:
      process.env.DATABASE_URL ||
      (process.env.NODE_ENV === 'production'
        ? process.env.NEON_DATABASE_URL
        : process.env.LOCAL_DATABASE_URL),
  },
});
