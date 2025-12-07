const express = require("express");
const AWSXRay = require("aws-xray-sdk");

AWSXRay.captureHTTPsGlobal(require("http"));
AWSXRay.captureHTTPsGlobal(require("https"));

const app = express();

app.use(AWSXRay.express.openSegment("xray-sample-app"));

// Home route
app.get("/", (req, res) => {
  res.json({ message: "Hello from ECS with X-Ray!" });
});

// Slow route (simulates latency)
app.get("/slow", async (req, res) => {
  await new Promise(resolve => setTimeout(resolve, 3000)); // 3 sec delay
  res.json({ message: "This route is slow!" });
});

app.use(AWSXRay.express.closeSegment());

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Server started on port " + port);
});
