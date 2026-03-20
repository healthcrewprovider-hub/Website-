import express, { type Express } from "express";
import cors from "cors";
import path from "path";
import { existsSync } from "fs";
import router from "./routes";

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

// In production, serve the built React frontend
if (process.env.NODE_ENV === "production") {
  const frontendDist = path.resolve(process.cwd(), "artifacts/health-crew-provider/dist/public");
  if (existsSync(frontendDist)) {
    app.use(express.static(frontendDist));
    // SPA fallback — serve index.html for any non-API route
    app.get("*", (_req, res) => {
      res.sendFile(path.join(frontendDist, "index.html"));
    });
  }
}

export default app;
