# aws-lambda-mock-context

> AWS Lambda mock context object

## Installation

```bash
npm install --save aws-lambda-mock-context
```

## Usage

This library can be used with promises or callbacks.

### Promises

```js
var context = require('aws-lambda-mock-context');

index.handler({hello: 'world'}, context());
        
context.Promise
    .then(function () {
        //=> succeed() called
    })
    .catch(function (err) {
        //=> fail() called
    });
```

### Callbacks

```js
var context = require('aws-lambda-mock-context');

index.handler({hello: 'wrld'}, context(function(err, result) {
    if(err) {
        //=> succeed() called
    } else {
        //=> fail() called
    }
));
```

## Related

- [aws-lambda-pify](https://github.com/SamVerschueren/aws-lambda-pify) - Promisify an AWS lambda function.

## License

MIT © Sam Verschueren
