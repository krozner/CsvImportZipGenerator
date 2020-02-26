#!/usr/bin/env bash
clear && echo "Wait..."

GeneratorPath="/var/www/app"
ContainerName=elabelz-node-zip-generator

echo "Processing: $1..."

docker exec -it $ContainerName bash -c "rm -rf /tmp/*"
docker exec -it $ContainerName bash -c "NODE_PATH=src $GeneratorPath/node_modules/.bin/ts-node $GeneratorPath/generate.ts $1"
