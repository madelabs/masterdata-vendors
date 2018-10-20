'use strict';

module.exports.list = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'List of products will return.'
    }),
  };
};

module.exports.single = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'A single product will return.'
    }),
  };
};
