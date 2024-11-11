import express from "express";
import { ROUTES } from "./routes.js";
import { setupLogging } from "./logging.js";
import { setupProxies } from "./proxy-setup/proxy.js";
import { setupAuth } from "./middlewares/setupAuth.js";
import cors from "cors";

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
setupLogging(app);
setupAuth(app, ROUTES);
setupProxies(app, ROUTES);

app.listen(port, () => {
  console.log(`Gateway app listening at http://localhost:${port}`);
});
