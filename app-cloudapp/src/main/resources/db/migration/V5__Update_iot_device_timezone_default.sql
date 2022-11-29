ALTER TABLE iot_devices ALTER COLUMN timezone SET DEFAULT 'Z';
UPDATE iot_devices SET timezone = '+05:30' WHERE timezone = NULL;
