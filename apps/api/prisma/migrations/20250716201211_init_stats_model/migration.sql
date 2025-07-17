-- CreateTable
CREATE TABLE "Stats" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tvl" BIGINT NOT NULL,
    "averageApy" INTEGER NOT NULL,
    "activeUsers" INTEGER NOT NULL,

    CONSTRAINT "Stats_pkey" PRIMARY KEY ("id")
);
