CREATE TABLE IF NOT EXISTS firmware (
id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
firmware_name       VARCHAR,
device_name         VARCHAR,
device_id           UUID,
firmware_version    VARCHAR,
firmware_added_date VARCHAR,
firmware_one        VARCHAR,
firmware_two        VARCHAR
);