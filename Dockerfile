FROM gcr.io/distroless/nodejs:16

WORKDIR /app

COPY dist/main.js main.js

CMD ["main.js"]
