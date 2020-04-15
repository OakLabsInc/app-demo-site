FROM oaklabs/oak:5.0.10

WORKDIR /app

COPY . /app

RUN npm i --progress=false --loglevel="error" \
    && npm cache clean --force \
    && apt-get update \
    && apt-get install -y unclutter


ENV NODE_ENV=production \
    ELECTRON_ENABLE_SECURITY_WARNINGS=false

EXPOSE 9001

CMD ["/app/src/server.js", "unclutter -idle 3"]