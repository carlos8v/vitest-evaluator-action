FROM node:slim

COPY entrypoint.sh /entrypoint.sh
COPY evaluator.js /evaluator.js

ENTRYPOINT ["/entrypoint.sh"]
