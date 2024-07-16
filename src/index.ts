import * as express from "express";
import configureBot from "./bot";

const app = express();

app.listen(3000);

configureBot();
