'use strict';

const compileTag = require('./compileTag');
const cosmiconfig = require('cosmiconfig');

const configExplorer = cosmiconfig('isograph', {
  searchPlaces: ['isograph.config.json'],
  loaders: {
    '.json': cosmiconfig.loadJson,
  },
});

let IsographConfig;
const result = configExplorer.searchSync();
if (result) {
  IsographConfig = result.config;
} else {
  throw new Error(
    'No config found. Do you have a isograph.config.json file somewhere?',
  );
}

module.exports = function BabelPluginIsograph(context) {
  const { types } = context;
  if (!types) {
    throw new Error(
      'BabelPluginIsograph: Expected plugin context to include "types", but got:' +
        String(context),
    );
  }

  const visitor = {
    CallExpression(path) {
      compileTag(types, path, IsographConfig);
    },
  };

  return {
    visitor: {
      Program(path, state) {
        path.traverse(visitor, state);
      },
    },
  };
};
