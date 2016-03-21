# aws-lambda-mock-context [![Build Status](https://travis-ci.org/SamVerschueren/aws-lambda-mock-context.svg?branch=master)](https://travis-ci.org/SamVerschueren/aws-lambda-mock-context)

> AWS Lambda mock context object


## Installation

```
$ npm install --save aws-lambda-mock-context
```


## Usage

```js
const context = require('aws-lambda-mock-context');

const ctx = context();

index.handler({hello: 'world'}, ctx);

ctx.Promise
    .then(() => {
        //=> succeed() called
    })
    .catch(err => {
        //=> fail() called
    });
```


## API

### context(options)

#### options

##### region

Type: `string`  
Default: `us-west-1`

The AWS region.

##### account

Type: `string`  
Default: `123456789012`

The account number.

##### functionName

Type: `string`  
Default: `aws-lambda-mock-context`

The name of the function.

##### functionVersion

Type: `string`  
Default: `$LATEST`

The version of the function.

##### memoryLimitInMB

Type: `string`  
Default: `128`

The memory limit.

##### alias

Type: `string`

The alias of the function.


## Related

- [aws-lambda-pify](https://github.com/SamVerschueren/aws-lambda-pify) - Promisify an AWS lambda function.


## License

MIT © Sam Verschueren
