CREATE TABLE IF NOT EXISTS alerts
(
    id        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sensor_id UUID,
    device_id UUID,
    timestamp TIMESTAMPTZ
);
