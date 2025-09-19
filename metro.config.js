const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add resolver configuration
config.resolver.alias = {
  ...config.resolver.alias,
  'react-native$': 'react-native-web',
};

// Add resolver platforms
config.resolver.platforms = ['web', 'ios', 'android'];

module.exports = config; 