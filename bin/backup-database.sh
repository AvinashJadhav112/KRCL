#!/bin/bash

/usr/bin/docker exec vt-postgres pg_dump -U vervetronics vervetronics | \
    /bin/gzip \
    >vervetronics-"$(date -u -Iseconds)".sql.gz
