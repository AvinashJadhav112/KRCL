.PHONY: influxd
# https://docs.influxdata.com/influxdb/v2.1/install/?t=Docker
influxd:
	docker run -d --name influxdb -p 8086:8086 influxdb:2.1.1 --reporting-disabled

.PHONY: influxsh
influxsh:
	docker exec -it influxdb /bin/bash
