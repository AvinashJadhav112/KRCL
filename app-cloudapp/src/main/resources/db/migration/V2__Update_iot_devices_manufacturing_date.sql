ALTER TABLE iot_devices ALTER COLUMN manufacturing_date TYPE DATE
USING TO_DATE(manufacturing_date, 'YYYY-MM-DD');
