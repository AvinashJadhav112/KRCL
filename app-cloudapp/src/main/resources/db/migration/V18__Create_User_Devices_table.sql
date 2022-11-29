CREATE TABLE IF NOT EXISTS user_devices
(
id                              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
devices_id                      UUID,
email                           VARCHAR,
user_details_id                 UUID
);
UPDATE user_devices SET user_details_id = (SELECT user_details_id from user_details WHERE user_details.email = user_devices.email);

ALTER TABLE user_devices ADD CONSTRAINT user_details_map_fk FOREIGN KEY (user_details_id) REFERENCES user_details(user_details_id);



