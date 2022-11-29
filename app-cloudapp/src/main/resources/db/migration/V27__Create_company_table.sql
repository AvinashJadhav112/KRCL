CREATE TABLE IF NOT EXISTS company (

  id      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_name    VARCHAR,
  email           VARCHAR,
  mobile_number   VARCHAR,
  website         VARCHAR,
  company_status  VARCHAR,
  company_added_date DATE
  );