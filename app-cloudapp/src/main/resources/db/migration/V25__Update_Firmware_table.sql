ALTER TABLE firmware DROP COLUMN device_name;

ALTER TABLE firmware DROP COLUMN device_id;

ALTER TABLE firmware RENAME COLUMN firmware_one TO firmwareBankOne_Path;

ALTER TABLE firmware RENAME COLUMN firmware_two TO firmwareBankTwo_Path;
