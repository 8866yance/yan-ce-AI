-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "openid" TEXT,
    "unionid" TEXT,
    "nickname" TEXT,
    "avatarUrl" TEXT,
    "phone" TEXT,
    "registeredAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastLoginAt" DATETIME,
    "loginIp" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "currentMembershipStatus" TEXT NOT NULL DEFAULT 'none',
    "currentPoints" INTEGER NOT NULL DEFAULT 0,
    "totalAnalysisCount" INTEGER NOT NULL DEFAULT 0,
    "totalRechargeAmount" DECIMAL NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "user_sessions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "sessionToken" TEXT,
    "deviceId" TEXT,
    "platform" TEXT,
    "ip" TEXT,
    "userAgent" TEXT,
    "lastHeartbeatAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "onlineStatus" TEXT NOT NULL DEFAULT 'online',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "user_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "membership_plans" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "price" DECIMAL NOT NULL,
    "durationDays" INTEGER NOT NULL,
    "analysisLimit" INTEGER NOT NULL DEFAULT 0,
    "unlimited" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "user_memberships" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "orderId" TEXT,
    "startAt" DATETIME NOT NULL,
    "endAt" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "analysisLimit" INTEGER NOT NULL DEFAULT 0,
    "analysisUsed" INTEGER NOT NULL DEFAULT 0,
    "unlimited" BOOLEAN NOT NULL DEFAULT false,
    "purchaseMode" TEXT NOT NULL DEFAULT 'renew_stack',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "user_memberships_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "user_memberships_planId_fkey" FOREIGN KEY ("planId") REFERENCES "membership_plans" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "user_memberships_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "payment_orders" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "point_packages" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "price" DECIMAL NOT NULL,
    "points" INTEGER NOT NULL,
    "bonusPoints" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "user_wallets" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "pointsBalance" INTEGER NOT NULL DEFAULT 0,
    "frozenPoints" INTEGER NOT NULL DEFAULT 0,
    "totalEarned" INTEGER NOT NULL DEFAULT 0,
    "totalSpent" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "user_wallets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "point_ledger" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "walletId" TEXT,
    "orderId" TEXT,
    "analysisRecordId" TEXT,
    "changeType" TEXT NOT NULL,
    "direction" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "beforeBalance" INTEGER NOT NULL,
    "afterBalance" INTEGER NOT NULL,
    "remark" TEXT,
    "operatorType" TEXT NOT NULL DEFAULT 'system',
    "operatorId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "point_ledger_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "point_ledger_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "payment_orders" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "point_ledger_analysisRecordId_fkey" FOREIGN KEY ("analysisRecordId") REFERENCES "analysis_records" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "payment_orders" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderNo" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "orderType" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "productName" TEXT,
    "amount" DECIMAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'CNY',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "paymentProvider" TEXT,
    "thirdPartyTradeNo" TEXT,
    "paidAt" DATETIME,
    "callbackRaw" TEXT,
    "callbackSignature" TEXT,
    "callbackProcessedAt" DATETIME,
    "refundedAt" DATETIME,
    "refundAmount" DECIMAL,
    "failReason" TEXT,
    "clientIp" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "payment_orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "analysis_records" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "submitContent" TEXT NOT NULL,
    "imageUrl" TEXT,
    "birthInfoJson" TEXT NOT NULL,
    "baziResultJson" TEXT NOT NULL,
    "aiResult" TEXT,
    "promptVersionId" TEXT,
    "pointsCost" INTEGER NOT NULL DEFAULT 0,
    "memberFree" BOOLEAN NOT NULL DEFAULT false,
    "analysisType" TEXT NOT NULL,
    "durationMs" INTEGER,
    "success" BOOLEAN NOT NULL DEFAULT false,
    "failReason" TEXT,
    "clientIp" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "analysis_records_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "analysis_records_promptVersionId_fkey" FOREIGN KEY ("promptVersionId") REFERENCES "prompt_versions" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "prompt_versions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "versionNo" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "changeReason" TEXT,
    "baseVersionId" TEXT,
    "baseVersionNo" INTEGER,
    "createdBy" TEXT,
    "activatedBy" TEXT,
    "activatedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "prompt_suggestions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "questionType" TEXT NOT NULL,
    "userNeed" TEXT NOT NULL,
    "currentWeakness" TEXT NOT NULL,
    "addRules" TEXT NOT NULL,
    "removeRules" TEXT,
    "recommendedSnippet" TEXT NOT NULL,
    "sampleRecordIds" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "generatedBy" TEXT NOT NULL DEFAULT 'system',
    "reviewedBy" TEXT,
    "reviewedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "request_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "ip" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "userAgent" TEXT,
    "statusCode" INTEGER NOT NULL,
    "durationMs" INTEGER NOT NULL,
    "requestTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "requestId" TEXT,
    "provider" TEXT,
    "country" TEXT,
    "region" TEXT,
    "city" TEXT,
    CONSTRAINT "request_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "security_events" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventType" TEXT NOT NULL,
    "attackIp" TEXT NOT NULL,
    "requestCount" INTEGER NOT NULL DEFAULT 0,
    "attackPath" TEXT,
    "firstSeenAt" DATETIME NOT NULL,
    "lastSeenAt" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'open',
    "sourceProvider" TEXT,
    "rawData" TEXT,
    "handledBy" TEXT,
    "handledAt" DATETIME,
    "note" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ip_blocklist" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ip" TEXT NOT NULL,
    "reason" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdBy" TEXT,
    "expiresAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "admin_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "nickname" TEXT,
    "role" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "lastLoginAt" DATETIME,
    "lastLoginIp" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "admin_audit_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "adminId" TEXT,
    "action" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "resourceId" TEXT,
    "beforeJson" TEXT,
    "afterJson" TEXT,
    "ip" TEXT,
    "userAgent" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "admin_audit_logs_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "admin_users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "dashboard_daily_stats" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "statDate" DATETIME NOT NULL,
    "newUsers" INTEGER NOT NULL DEFAULT 0,
    "activeUsers" INTEGER NOT NULL DEFAULT 0,
    "analysisCount" INTEGER NOT NULL DEFAULT 0,
    "rechargeAmount" DECIMAL NOT NULL DEFAULT 0,
    "paidOrderCount" INTEGER NOT NULL DEFAULT 0,
    "abnormalRequests" INTEGER NOT NULL DEFAULT 0,
    "suspectedAttacks" INTEGER NOT NULL DEFAULT 0,
    "memberUsers" INTEGER NOT NULL DEFAULT 0,
    "pointRechargeUsers" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "dashboard_hourly_stats" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "statHour" DATETIME NOT NULL,
    "newUsers" INTEGER NOT NULL DEFAULT 0,
    "activeUsers" INTEGER NOT NULL DEFAULT 0,
    "analysisCount" INTEGER NOT NULL DEFAULT 0,
    "rechargeAmount" DECIMAL NOT NULL DEFAULT 0,
    "requestCount" INTEGER NOT NULL DEFAULT 0,
    "abnormalRequests" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "users_openid_key" ON "users"("openid");

-- CreateIndex
CREATE INDEX "users_unionid_idx" ON "users"("unionid");

-- CreateIndex
CREATE INDEX "users_status_idx" ON "users"("status");

-- CreateIndex
CREATE INDEX "users_registeredAt_idx" ON "users"("registeredAt");

-- CreateIndex
CREATE UNIQUE INDEX "user_sessions_sessionToken_key" ON "user_sessions"("sessionToken");

-- CreateIndex
CREATE INDEX "user_sessions_userId_idx" ON "user_sessions"("userId");

-- CreateIndex
CREATE INDEX "user_sessions_lastHeartbeatAt_idx" ON "user_sessions"("lastHeartbeatAt");

-- CreateIndex
CREATE INDEX "user_sessions_onlineStatus_idx" ON "user_sessions"("onlineStatus");

-- CreateIndex
CREATE INDEX "membership_plans_enabled_sortOrder_idx" ON "membership_plans"("enabled", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "user_memberships_orderId_key" ON "user_memberships"("orderId");

-- CreateIndex
CREATE INDEX "user_memberships_userId_status_idx" ON "user_memberships"("userId", "status");

-- CreateIndex
CREATE INDEX "user_memberships_endAt_idx" ON "user_memberships"("endAt");

-- CreateIndex
CREATE INDEX "point_packages_enabled_sortOrder_idx" ON "point_packages"("enabled", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "user_wallets_userId_key" ON "user_wallets"("userId");

-- CreateIndex
CREATE INDEX "point_ledger_userId_createdAt_idx" ON "point_ledger"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "point_ledger_orderId_idx" ON "point_ledger"("orderId");

-- CreateIndex
CREATE INDEX "point_ledger_analysisRecordId_idx" ON "point_ledger"("analysisRecordId");

-- CreateIndex
CREATE INDEX "point_ledger_changeType_idx" ON "point_ledger"("changeType");

-- CreateIndex
CREATE UNIQUE INDEX "payment_orders_orderNo_key" ON "payment_orders"("orderNo");

-- CreateIndex
CREATE INDEX "payment_orders_userId_createdAt_idx" ON "payment_orders"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "payment_orders_orderType_status_idx" ON "payment_orders"("orderType", "status");

-- CreateIndex
CREATE INDEX "payment_orders_thirdPartyTradeNo_idx" ON "payment_orders"("thirdPartyTradeNo");

-- CreateIndex
CREATE INDEX "payment_orders_createdAt_idx" ON "payment_orders"("createdAt");

-- CreateIndex
CREATE INDEX "analysis_records_userId_createdAt_idx" ON "analysis_records"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "analysis_records_analysisType_createdAt_idx" ON "analysis_records"("analysisType", "createdAt");

-- CreateIndex
CREATE INDEX "analysis_records_success_idx" ON "analysis_records"("success");

-- CreateIndex
CREATE INDEX "prompt_versions_status_idx" ON "prompt_versions"("status");

-- CreateIndex
CREATE UNIQUE INDEX "prompt_versions_versionNo_key" ON "prompt_versions"("versionNo");

-- CreateIndex
CREATE INDEX "prompt_suggestions_status_createdAt_idx" ON "prompt_suggestions"("status", "createdAt");

-- CreateIndex
CREATE INDEX "request_logs_ip_requestTime_idx" ON "request_logs"("ip", "requestTime");

-- CreateIndex
CREATE INDEX "request_logs_path_requestTime_idx" ON "request_logs"("path", "requestTime");

-- CreateIndex
CREATE INDEX "request_logs_statusCode_requestTime_idx" ON "request_logs"("statusCode", "requestTime");

-- CreateIndex
CREATE INDEX "request_logs_userId_requestTime_idx" ON "request_logs"("userId", "requestTime");

-- CreateIndex
CREATE INDEX "security_events_eventType_status_idx" ON "security_events"("eventType", "status");

-- CreateIndex
CREATE INDEX "security_events_attackIp_lastSeenAt_idx" ON "security_events"("attackIp", "lastSeenAt");

-- CreateIndex
CREATE UNIQUE INDEX "ip_blocklist_ip_key" ON "ip_blocklist"("ip");

-- CreateIndex
CREATE INDEX "ip_blocklist_status_expiresAt_idx" ON "ip_blocklist"("status", "expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "admin_users_email_key" ON "admin_users"("email");

-- CreateIndex
CREATE INDEX "admin_users_role_status_idx" ON "admin_users"("role", "status");

-- CreateIndex
CREATE INDEX "admin_audit_logs_adminId_createdAt_idx" ON "admin_audit_logs"("adminId", "createdAt");

-- CreateIndex
CREATE INDEX "admin_audit_logs_resource_resourceId_idx" ON "admin_audit_logs"("resource", "resourceId");

-- CreateIndex
CREATE UNIQUE INDEX "dashboard_daily_stats_statDate_key" ON "dashboard_daily_stats"("statDate");

-- CreateIndex
CREATE UNIQUE INDEX "dashboard_hourly_stats_statHour_key" ON "dashboard_hourly_stats"("statHour");

-- CreateIndex
CREATE INDEX "dashboard_hourly_stats_statHour_idx" ON "dashboard_hourly_stats"("statHour");

