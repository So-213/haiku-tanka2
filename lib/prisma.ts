// Prismaクライアントのインスタンスを作成するためのファイル

import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// 接続をクリーンアップする関数
const cleanup = async () => {
  if (prisma) {
    await prisma.$disconnect();
  }
};

// プロセス終了時に接続をクリーンアップ
if (process.env.NODE_ENV === 'production') {
  process.on('SIGTERM', cleanup);
  process.on('SIGINT', cleanup);
} 