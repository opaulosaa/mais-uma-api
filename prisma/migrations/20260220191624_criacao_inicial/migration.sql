/*
  Warnings:

  - Added the required column `cargo` to the `Pessoa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senha` to the `Pessoa` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Conhecimento" DROP CONSTRAINT "Conhecimento_pessoa_id_fkey";

-- AlterTable
ALTER TABLE "Pessoa" ADD COLUMN     "cargo" TEXT NOT NULL,
ADD COLUMN     "senha" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Conhecimento" ADD CONSTRAINT "Conhecimento_pessoa_id_fkey" FOREIGN KEY ("pessoa_id") REFERENCES "Pessoa"("id") ON DELETE CASCADE ON UPDATE CASCADE;
