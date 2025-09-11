"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBlurDataURL = getBlurDataURL;
const sharp_1 = __importDefault(require("sharp"));
const node_fetch_1 = __importDefault(require("node-fetch"));
async function getBlurDataURL(imageUrl) {
    const response = await (0, node_fetch_1.default)(imageUrl);
    const buffer = await response.buffer();
    const resized = await (0, sharp_1.default)(buffer)
        .resize(10, 10)
        .blur()
        .jpeg({ quality: 50 })
        .toBuffer();
    const base64 = resized.toString('base64');
    return `data:image/jpeg;base64,${base64}`;
}
