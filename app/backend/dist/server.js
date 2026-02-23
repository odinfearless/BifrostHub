"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_js_1 = __importDefault(require("./app.js"));
const logger_1 = require("./plugins/logger");
const HOST = process.env.HOST;
const PORT = Number(process.env.PORT);
app_js_1.default.listen({ port: PORT, host: HOST }).then(() => {
    logger_1.logger.info(`🚀 Server running on http://${HOST}:${PORT}`);
});
