FROM oaklabs/oak:5.0.10

VOLUME ["/data/share"]

WORKDIR /app

COPY . /app

RUN npm i --progress=false --loglevel="error" \
    && npm cache clean --force

ENV NODE_ENV=production \
    ELECTRON_ENABLE_SECURITY_WARNINGS=false

EXPOSE 9001

CMD ["/app/src/server.js"]