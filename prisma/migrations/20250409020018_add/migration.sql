-- CreateEnum
CREATE TYPE "DepartmentStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "DepartmentType" AS ENUM ('HR', 'IT', 'SALES', 'MARKETING', 'FINANCE');

-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "deepartement" "DepartmentType" NOT NULL DEFAULT 'HR',
ADD COLUMN     "slectuser" "Role" NOT NULL DEFAULT 'EMPLOYEE';
