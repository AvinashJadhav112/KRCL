ALTER TABLE user_details ADD COLUMN device_name VARCHAR;

ALTER TABLE user_details ADD COLUMN device_id UUID;

UPDATE user_details SET device_id = (SELECT iot_device_id FROM iot_devices WHERE user_details.device_name = iot_devices.device_name);

ALTER TABLE user_details ADD CONSTRAINT iot_device_map_fk FOREIGN KEY (device_id) REFERENCES iot_devices(iot_device_id);

