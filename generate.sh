#!/usr/bin/env bash
clear && echo "Wait..."

GeneratorPath="/var/www/app"
ContainerName=elabelz-node-zip-generator

echo "Processing: $1..."

docker exec -it $ContainerName bash -c "rm -rf /tmp/*"
docker exec -it $ContainerName bash -c "NODE_PATH=src $GeneratorPath/node_modules/.bin/ts-node $GeneratorPath/generate.ts $1"


#docker exec -it elabelz-node-zip-generator bash
#NODE_PATH=src /var/www/app/node_modules/.bin/ts-node /var/www/app/generate.ts /var/www/app/test-1.csv
