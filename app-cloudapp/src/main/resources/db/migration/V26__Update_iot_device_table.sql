ALTER TABLE iot_devices ADD firmware_id UUID;

ALTER TABLE iot_devices RENAME COLUMN latest_firmware_version TO server_firmware_version;

ALTER TABLE iot_devices ADD download_status VARCHAR;
