const path = require('path')
const nodeExternals = require('webpack-node-externals');


const maybeMqttExternal = (predicate) => {
  if(predicate) return ({
    mqtt: 'mqtt'
  })

  return {}
}

module.exports = function (context, options, utils) {
  return {
    name: 'mqttjs',
    configureWebpack(config, isServer, utils) {
      return {
        externals: {
          ...maybeMqttExternal(isServer)
        },
        module: {
          rules: [
            {
              test: /\.js$/,
              use: [path.resolve(__dirname, 'remove-hashbang-loader.js')],
            },
          ],
        },
      };
    },
  };
};