'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
const Product = require('./product');

const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.create = async (event, context, callback) => {
  const data = JSON.parse(event.body);
  const product = {
      id: data.id, 
      code: data.code, 
      description: data.description, 
      height: data.height,
      length: data.length,
      name: data.name,
      revision: data.revision,
      status: data.status,
      unitOfMeasure: data.unitOfMeasure,
      weight: data.weight,
      width: data.width
  };
  console.log('constructed', product);
  
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: product
  };
  console.log(params);
  
  dynamodb.put(params, (error) => {
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        body: { message: 'Couldn\'t create the product.' }
      });
      return;
    }
    
    console.log('saved', product);
    callback(null, {
      response: 200,
      body: JSON.stringify(params.Item)
    });
  });
};

module.exports.delete = async (event, context, callback) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id: event.pathParameters.id
    }
  };
  
  dynamodb.delete(params, (error) => {
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/json' },
        body: { message: 'Couldn\'t delete the product.' }
      });
      return;
    }
    
    callback(null, {
      statusCode: 200,
      body: JSON.stringify({})
    });
  });
};

module.exports.list = async (event, context, callback) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE
  };
  
  dynamodb.scan(params, (error, result) => {
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        body: 'Couldn\'t retrieve products.'
      });
      return;
    }
    
    callback(null, {
      statusCode: 200,
      body: JSON.stringify(result.Items)
    });
  });
};

module.exports.replace = async (event, context, callback) => {
  // todo
};

module.exports.single = async (event, context, callback) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id: event.pathParameters.id
    }
  };
  
  dynamodb.get(params, (error, result) => {
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        body: { message: 'Couldn\'t retrieve product.' } 
      });
      return;
    }
    
    callback(null, {
      statusCode: 200,
      body: JSON.stringify(result.Item)
    });
  });
};

module.exports.update = async (event, context, callback) => {
  // todo
};
