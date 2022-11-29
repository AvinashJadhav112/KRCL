-- Create the database in a local PostgreSQL.
-- This is not used when using Docker.
CREATE DATABASE vervetronics;
CREATE USER vervetronics WITH ENCRYPTED PASSWORD 'vervetronics';
GRANT ALL PRIVILEGES ON DATABASE vervetronics TO vervetronics;
