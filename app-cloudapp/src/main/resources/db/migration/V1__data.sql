CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users
(
 user_id  BIGSERIAL  PRIMARY KEY,
 email VARCHAR (255),
 password VARCHAR (255)
);

ALTER TABLE users ADD CONSTRAINT UQ_EMAIL UNIQUE (email);

CREATE TABLE IF NOT EXISTS roles (
 role_id  BIGSERIAL PRIMARY KEY,
 name VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS users_roles (
 user_id BIGSERIAL NOT NULL,
 role_id BIGSERIAL NOT NULL,
 PRIMARY KEY (user_id, role_id),
 FOREIGN KEY (role_id) REFERENCES roles,
 FOREIGN KEY (user_id) REFERENCES users
);

-- Generate the password with `spring encodepassword <password>`
INSERT INTO users
    (email,                           password)
    VALUES
    ('vervetronics@vervetronics.com', '{bcrypt}$2a$10$es8MTSrbRYLZztQoG12hruj5hH.3T8wUh3QfRaJcPzRAYN7acQNn2');

CREATE TABLE IF NOT EXISTS iot_models
(
    id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    iot_model_name          VARCHAR
);

CREATE TABLE IF NOT EXISTS sensors
(
    id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alert_criticality       VARCHAR,
    dashboard_order          VARCHAR,
    alert_time              VARCHAR,
    formula                 VARCHAR,
    max                     VARCHAR,
    min                     VARCHAR,
    name                    VARCHAR,
    processed_data_type     VARCHAR,
    raw_data_type           VARCHAR,
    unit                    VARCHAR,
    sensor_id              VARCHAR ,
    iot_model_id            UUID NOT NULL,
    FOREIGN KEY (iot_model_id) REFERENCES iot_models(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS iot_devices
(
    iot_device_id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    serial_number           VARCHAR,
    device_name             VARCHAR,
    status                  VARCHAR,
    manufacturing_date      VARCHAR,
    model_name              VARCHAR,
    latest_firmware_version VARCHAR,
    device_firmware_version VARCHAR
);
