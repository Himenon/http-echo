import express from "express";
import morgan from "morgan";
import * as os from "os";
import concat from "concat-stream";
import jwt from "jsonwebtoken";

const app = express();

app.set("json spaces", 2);

app.use(morgan("combined"));

app.use(function (req, res, next) {
  req.pipe(
    concat(function (data) {
      req.body = data.toString("utf8");
      next();
    }),
  );
});

app.all("*", (req, res) => {
  const echo: Record<string, unknown> = {
    path: req.path,
    headers: req.headers,
    method: req.method,
    body: req.body,
    cookies: req.cookies,
    fresh: req.fresh,
    hostname: req.hostname,
    ip: req.ip,
    ips: req.ips,
    protocol: req.protocol,
    query: req.query,
    subdomains: req.subdomains,
    xhr: req.xhr,
    os: {
      hostname: os.hostname(),
    },
  };
  if (process.env.JWT_HEADER) {
    const token = req.headers[process.env.JWT_HEADER.toLowerCase()];
    if (!token) {
      echo.jwt = token;
    } else if (typeof token === "string") {
      const decoded = jwt.decode(token, { complete: true });
      echo.jwt = decoded;
    }
  }
  res.json(echo);
});

const server = app.listen(process.env.PORT || 80);
let calledClose = false;

process.on("exit", function () {
  if (calledClose) return;
  console.log("Got exit event. Trying to stop Express server.");
  server.close(function () {
    console.log("Express server closed");
  });
});

process.on("SIGINT", function () {
  console.log("Got SIGINT. Trying to exit gracefully.");
  calledClose = true;
  server.close(function () {
    console.log("Exoress server closed. Asking process to exit.");
    process.exit();
  });
});
