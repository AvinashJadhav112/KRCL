CREATE TABLE IF NOT EXISTS user_details
(
    user_details_id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name                  VARCHAR,
    last_name                   VARCHAR,
    email                       VARCHAR,
    alternate_email             VARCHAR,
    mobile_number               VARCHAR,
    alternate_mobile_number     VARCHAR,
    company_name                VARCHAR,
    user_id                     BIGSERIAL NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);