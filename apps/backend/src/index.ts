import { configureOpenAPI, createApp } from "./lib";
import routes from "./routes";

const app = createApp();

app.route("/api", routes);

configureOpenAPI(app);

export default app;
