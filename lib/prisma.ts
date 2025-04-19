// Prismaクライアントのインスタンスを作成するためのファイル

import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export { prisma };

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