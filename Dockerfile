FROM oaklabs/oak:5.0.10

WORKDIR /app

COPY . /app

RUN npm i --progress=false --loglevel="error" \
    && npm cache clean --force \
    && pat-get update \
    && apt-get install net-tools


ENV NODE_ENV=production \
    ELECTRON_ENABLE_SECURITY_WARNINGS=false


CMD ["/app/src/server.js"]