/** @type {import('next').NextConfig} */
const path = require("node:path");
// const isographSwcPlugin = "@isograph/swc-plugin";
const isographSwcPlugin = path.join(
  __dirname,
  "../../crates/swc_plugin/swc_plugin_isograph.wasm",
);

module.exports = {
  experimental: {
    swcPlugins: [[isographSwcPlugin, {}]],
  },
};
