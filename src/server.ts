import "dotenv/config";
import express from "express";
import { errorMiddleware } from "./interfaces/http/middlewares/errorMiddleware";
import routes from "./interfaces/http/routes/routes";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";

export const app = express();

app.use(express.json());
app.use(routes);
app.use(errorMiddleware);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

if (process.env.NODE_ENV !== "test") {
  app.listen(3000, () => {
    console.log(" Server running on port 3000");
  });
}