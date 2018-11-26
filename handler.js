'use strict';

const name = 'vendor';
const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
const Vendor = require('./vendor');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const headers = {
  "Access-Control-Allow-Origin" : "*" // Required for CORS support to work
};

module.exports.create = async (event, context) => {
  const data = JSON.parse(event.body);
  const vendor = new Vendor(
      data.id,
      event.requestContext.authorizer.claims["custom:tenant_id"], 
      data.name,
      data.description,
      data.status,
      data.phone,
      data.email,
      data.address
  );
  
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: vendor
  };
  
  try {
    const result = await dynamodb.put(params).promise();
    return {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify(params.Item)
    };
  }
  catch (error) {
    console.error('error', error);
    return {
      statusCode: error.statusCode || 501,
      headers: headers,
      error: `Could not create ${name}`
    };
  }
};

module.exports.delete = async (event, context) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id: event.pathParameters.id
    }
  };
  
  try {
    const result = await dynamodb.delete(params).promise();
    return {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify({}),
    };
  }
  catch (error) {
    console.error('error', error);
    return {
      statusCode: error.statusCode || 501,
      headers: headers,
      error: `Could not delete ${name}`
    };
  }
};

module.exports.list = async (event, context) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE
  };
  
  try {
    const result = await dynamodb.scan(params).promise();
    return {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify(result.Items)
    };
  }
  catch (error) {
    console.error('error', error);
    return {
      statusCode: error.statusCode || 501,
      headers: headers,
      error: `Could not get ${name} list`
    };
  }
};

module.exports.replace = async (event, context) => {
  const data = JSON.parse(event.body);
  const vendor = new Vendor(
      data.id,
      event.requestContext.authorizer.claims["custom:tenant_id"], 
      data.name, 
      data.description,
      data.status,
      data.phone,
      data.email,
      data.address,
      data.created,
      new Date()
  );
  
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: vendor
  };
  
  try {
    const result = await dynamodb.put(params).promise();
    return {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify(params.Item)
    };
  }
  catch (error) {
    console.error('error', error);
    return {
      statusCode: error.statusCode || 501,
      headers: headers,
      error: `Could not update ${name}`
    };
  }
};

module.exports.single = async (event, context) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id: event.pathParameters.id
    }
  };
  
  try {
    const result = await dynamodb.get(params).promise();
    
    // if no items were found
    if (!result || typeof result === 'undefined' || !result.Item) {
      return {
        statusCode: 404,
        headers: headers,
        body: { message: `Couldn\'t find ${name}` }
      };
    }
    
    return {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify(result.Item),
    };
  }
  catch (error) {
    console.error('error', error);
    return {
      statusCode: error.statusCode || 501,
      headers: headers,
      error: `Could not delete ${name}`
    };
  }
};

module.exports.update = async (event, context) => {
  const data = JSON.parse(event.body);

  var expression = `SET name = :name, description = :description, 
    phone = :phone, email = :email, address = :address,
    lastUpdated = :lastUpdated`;

  var expressionValues = {
    ':description': data.description,
    ':phone': data.phone,
    ':email': data.email,
    ':address': data.address,
    ':lastUpdated': data.lastUpdated
  };

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id: event.pathParameters.id
    },
    UpdateExpression: expression,
    ExpressionAttributeValues: expressionValues,
    ReturnValues: 'ALL_NEW'
  };
  
  try {
    const result = await dynamodb.update(params).promise();
    
    // if no items were found
    if (!result || typeof result === 'undefined' || !result.Item) {
      return {
        statusCode: 404,
        headers: headers,
        body: { message: `Couldn\'t find ${name}` }
      };
    }
    
    return {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify(result.Item),
    };
  }
  catch (error) {
    console.error('error', error);
    return {
      statusCode: error.statusCode || 501,
      headers: headers,
      error: `Could not update ${name}`
    };
  }
};
