#!/usr/bin/env bash
# deploy fe for mac env
sed "s/127.0.0.1:9090/host.docker.internal:9099/g" $(pwd)/server/config/host.js > $(pwd)/server/config/host.js.1
sed "s/127.0.0.1:9091/host.docker.internal:9091/g" $(pwd)/server/config/host.js.1 > $(pwd)/server/config/host.js.mac
docker run -d --name comandx -p 80:80 --platform linux/amd64 --add-host host.docker.internal:host-gateway -v $(pwd)/server/config/host.js.mac:/comandx/server/config/host.js galaxyfuture/comandx:latest
