'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
const Product = require('./product');

const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.create = async (event, context) => {
  const data = JSON.parse(event.body);
  const product = new Product(
      data.id, 
      data.code, 
      data.description,
      data.height,
      data.length,
      data.name,
      data.revision,
      data.status,
      data.unitOfMeasure,
      data.weight,
      data.width
  );
  
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: product
  };
  
  return await new Promise((resolve, reject) => {
    dynamodb.put(params, (error, result) => {
      if (error) {
        console.error('error', error);
        resolve({
          statusCode: error.statusCode || 501,
          body: { message: 'Couldn\'t create the product.' }
        });
      }
      
      resolve({
        statusCode: 200,
        body: JSON.stringify(params.Item),
      });
    });
  });
};

module.exports.delete = async (event, context) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id: event.pathParameters.id
    }
  };
  
  return await new Promise((resolve, reject) => {
    dynamodb.delete(params, (error) => {
      if (error) {
        console.error(error);
        resolve({
          statusCode: error.statusCode || 501,
          body: { message: 'Couldn\'t delete the product.' }
        });
      }
      
      resolve({
        statusCode: 200,
        body: JSON.stringify({}),
      });
    });
  });
};

module.exports.list = async (event, context) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE
  };
  
  return await new Promise((resolve, reject) => {
    dynamodb.scan(params, (error, result) => {
      if (error) {
        console.error(error);
        resolve({
          statusCode: error.statusCode || 501,
          body: 'Couldn\'t retrieve products.'
        });
      }
      
      resolve({
        statusCode: 200,
        body: JSON.stringify(result.Items),
      });
    });
  });
    
};

module.exports.replace = async (event, context) => {
  // todo
};

module.exports.single = async (event, context) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id: event.pathParameters.id
    }
  };
  
  return await new Promise((resolve, reject) => {
    dynamodb.get(params, (error, result) => {
      if (error) {
        console.error(error);
        resolve({
          statusCode: error.statusCode || 501,
          body: { message: 'Couldn\'t retrieve product.' } 
        });
      }
      
      if (!result || typeof result === 'undefined' || !result.Item) {
        resolve({
          statusCode: 404,
          body: { message: 'Couldn\'t find product.' }
        });
      }
      
      resolve({
        statusCode: 200,
        body: JSON.stringify(result.Item),
      });
    });
  });
};

module.exports.update = async (event, context) => {
  // todo
};
