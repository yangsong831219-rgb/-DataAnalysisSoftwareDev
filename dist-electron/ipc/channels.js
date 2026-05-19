"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// electron/ipc/channels.ts
var channels_exports = {};
__export(channels_exports, {
  CHANNELS: () => CHANNELS
});
module.exports = __toCommonJS(channels_exports);
var CHANNELS = {
  LOAD_FILE: "file:load",
  CLEAN_DATA: "data:clean",
  CALC_FORMULA: "formula:calculate",
  ANALYZE: "data:analyze",
  GENERATE_REPORT: "report:generate",
  GET_TEMPLATES: "template:get-all",
  SAVE_TEMPLATE: "template:save"
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CHANNELS
});
