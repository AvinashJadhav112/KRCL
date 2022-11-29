ALTER TABLE iot_devices ADD COLUMN iot_model_id UUID;

UPDATE iot_devices SET iot_model_id = (SELECT id FROM iot_models WHERE iot_models.iot_model_name = iot_devices.model_name LIMIT 1);

ALTER TABLE iot_devices ADD CONSTRAINT iot_models_map_fk FOREIGN KEY (iot_model_id) REFERENCES iot_models(id);
