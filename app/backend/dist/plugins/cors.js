"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const cors_1 = __importDefault(require("@fastify/cors"));
async function corsPlugin(fastify) {
    await fastify.register(cors_1.default, {
        origin: process.env.NODE_ENV === 'production'
            ? ['http://app.bifrosthub.com']
            : true,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    });
}
exports.default = (0, fastify_plugin_1.default)(corsPlugin);
