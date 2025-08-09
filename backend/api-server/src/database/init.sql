-- Create database if not exists
SELECT 'CREATE DATABASE disaster_relief'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'disaster_relief')\gexec

-- Connect to the database
\c disaster_relief

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_disasters_status ON disasters(status);
CREATE INDEX IF NOT EXISTS idx_disasters_created_at ON disasters(created_at);
CREATE INDEX IF NOT EXISTS idx_vendors_disaster_zone ON vendors(disaster_zone_id);
CREATE INDEX IF NOT EXISTS idx_transactions_timestamp ON transactions(timestamp);
CREATE INDEX IF NOT EXISTS idx_transactions_voucher ON transactions(voucher_id);
CREATE INDEX IF NOT EXISTS idx_proof_ipfs ON proof_of_aids(ipfs_hash);