#!/bin/sh -l
set -x

run_npm_start=$1
wait_for_url=$2

npm install

if $run_npm_start ; then
  npm start & npx wait-on -t 300000
fi

npm test -- --json --forceExit --outputFile=evaluation.json
node /evaluator.js evaluation.json .evaluator/requirements.json result.json

if [ $? != 0 ]; then
  echo "Execution error"
  exit 1
fi

echo ::set-output name=result::`cat result.json`
