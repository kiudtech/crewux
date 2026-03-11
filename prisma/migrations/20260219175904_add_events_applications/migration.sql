-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "organizerId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "shortDesc" TEXT,
    "category" TEXT NOT NULL,
    "eventType" TEXT NOT NULL DEFAULT 'IN_PERSON',
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "registrationDeadline" DATETIME,
    "venue" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "virtualLink" TEXT,
    "requiredSkills" TEXT NOT NULL DEFAULT '[]',
    "rolesNeeded" TEXT NOT NULL DEFAULT '[]',
    "totalSlots" INTEGER NOT NULL DEFAULT 0,
    "filledSlots" INTEGER NOT NULL DEFAULT 0,
    "bannerImage" TEXT,
    "contactEmail" TEXT,
    "contactPhone" TEXT,
    "perks" TEXT,
    "eligibility" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Event_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventId" TEXT NOT NULL,
    "applicantId" TEXT NOT NULL,
    "teamId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'APPLIED',
    "role" TEXT,
    "message" TEXT,
    "orgNote" TEXT,
    "appliedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Application_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Application_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Application_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Application_eventId_applicantId_key" ON "Application"("eventId", "applicantId");
