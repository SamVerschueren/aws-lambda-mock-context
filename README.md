# aws-lambda-mock-context

> This library returns a mock context object that can be used to test lambda functions

## Installation

```bash
npm install --save aws-lambda-mock-context
```

## Usage

This library can be used with promises or callbacks.

```javascript
// module dependencies
var context = require('aws-lambda-mock-context');

// Start the test
describe('Lambda Test', function() {
    
    it('Should call the succeed method', function(done) {
        index.handler({hello: 'world'}, context());
        
        context.Promise
            .then(function() {
                // succeed() called
                done();
            })
            .catch(function(err) {
                // fail() called
                done(err);
            });
    });
    
    it('Should call the fail method', function(done) {
        index.handler({hello: 'wrld'}, context(function(err, result) {
            if(err) {
                // If we have an error, it's fine
                done();   
            }
            else {
                // If we don't have an error, it means the fail() method was not called
                done(new Error('Fail not called');   
            }
        ));
    });
});
```

## Contributors

- Sam Verschueren [<sam.verschueren@gmail.com>]

## License

MIT © Sam Verschueren
