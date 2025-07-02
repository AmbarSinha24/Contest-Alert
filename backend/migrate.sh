#!/usr/bin/env bash
set -e

# load env vars from .env
export $(grep -v '^#' .env | xargs)

# apply DDL changes
mysql -u"$DB_USER" -p"$DB_PASS" -h"$DB_HOST" "$DB_NAME" <<'SQL'
  CREATE TABLE IF NOT EXISTS platforms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
  );
  CREATE TABLE IF NOT EXISTS contest_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
  );
  CREATE TABLE IF NOT EXISTS reminder_preferences (
    id INT AUTO_INCREMENT PRIMARY KEY,
    UserId INT NOT NULL,
    ContestTypeId INT NOT NULL,
    UNIQUE KEY ux_user_contest (UserId, ContestTypeId),
    FOREIGN KEY (UserId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (ContestTypeId) REFERENCES contest_types(id) ON DELETE CASCADE
  );
  ALTER TABLE contests
    ADD COLUMN PlatformId INT NULL,
    ADD COLUMN ContestTypeId INT NULL,
    ADD CONSTRAINT fk_contest_platform
      FOREIGN KEY (PlatformId) REFERENCES platforms(id) ON DELETE SET NULL,
    ADD CONSTRAINT fk_contest_type
      FOREIGN KEY (ContestTypeId) REFERENCES contest_types(id) ON DELETE SET NULL;
SQL

echo "✅ Database schema updated."
