import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import client from "prom-client";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.port || 4000;

const register = new client.Registry();

// ✅ Collect default Node.js & process metrics (CPU, memory, event loop, etc.)
client.collectDefaultMetrics({ register });

// ✅ Custom Counter: track API requests
const httpRequestCounter = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status"],
});
register.registerMetric(httpRequestCounter);

// ✅ Custom Histogram: track response times
const httpResponseTimeHistogram = new client.Histogram({
  name: "http_response_time_seconds",
  help: "HTTP response times in seconds",
  labelNames: ["method", "route", "status"],
  buckets: [0.1, 0.5, 1, 2, 5], // response time buckets
});
register.registerMetric(httpResponseTimeHistogram);

// Middleware to track requests
app.use((req, res, next) => {
  const end = httpResponseTimeHistogram.startTimer();
  res.on("finish", () => {
    httpRequestCounter.inc({
      method: req.method,
      route: req.path,
      status: res.statusCode,
    });
    end({ method: req.method, route: req.path, status: res.statusCode });
  });
  next();
});

// ✅ Metrics endpoint (Prometheus scrapes this)
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

app.get("/", (req, res) => {
  res.status(200).send("Hello I am using AWS EKS");
});

app.get("/hello", (req, res) => {
  res.status(200).send("Hello I am using AWS EKS hstysyhfjkvg");
});

app.listen(port, () => {
  console.log(`listening on ${port}`);
});
