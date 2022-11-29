ALTER TABLE alerts
    ADD COLUMN processed_value VARCHAR;
ALTER TABLE alerts
    ADD COLUMN alert_criticality VARCHAR;
ALTER TABLE alerts
    DROP COLUMN employee_id;
