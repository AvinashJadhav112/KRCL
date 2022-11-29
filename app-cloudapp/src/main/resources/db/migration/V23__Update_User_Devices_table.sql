ALTER TABLE user_devices DROP COLUMN user_details_id;

ALTER TABLE user_devices ALTER COLUMN devices_id TYPE VARCHAR;

create or replace view show_user_devices as select user_devices.id, user_details.user_details_id, user_details.email, user_devices.devices_id from user_details INNER JOIN user_devices on user_details.email=user_devices.email;