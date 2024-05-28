const presets = [['@babel/preset-env', { targets: { node: 'current' } }]]
const plugins = ['dynamic-import-node', "@babel/plugin-syntax-import-assertions"]
module.exports = { presets, plugins }
