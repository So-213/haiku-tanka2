// Prismaクライアントのインスタンスを作成するためのファイル

import { PrismaClient } from '@/lib/generated/prisma';

// PrismaClientのグローバル型定義を拡張
declare global {
  var prisma: PrismaClient | undefined;
}

// 開発環境でのホットリロード時に複数のPrismaClientインスタンスが作成されるのを防ぐ
const prisma = global.prisma || new PrismaClient({
  log: ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

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

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export { prisma }; 