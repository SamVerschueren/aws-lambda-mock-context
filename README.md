# aws-lambda-mock-context

> This library returns a mock context object that can be used to test lambda functions

## Installation

```bash
npm install --save aws-lambda-mock-context
```

## Usage

The library can be used in combination with [SinonJS](http://sinonjs.org/) to test if the correct
methods are called.

```javascript
// module dependencies
var chai = require('chai'),
    sinon = require('sinon'),
    sinonChai = require('sinonChai'),
    Q = require('q'),
    ctx = require('aws-lambda-mock-context');;

// Use the should flavour
chai.should();
chai.use(sinonChai);

// Start the test
describe('Lambda Test', function() {
    
    // Create a new context
    var ctx = context();
    
    beforeEach(function() {
        // Spy the succeed function
        sinon.spy(ctx, 'succeed');
    });
    
    afterEach(function() {
        // Restore it back to normal
        ctx.succeed.restore();
    });
    
    it('Should call the succeed method', function(done) {
        Q.fcall(function() {
            // Call the handler method
            return index.handler({hello: 'world'}, this.ctx);
        }).then(function() {
            // Test if the succeed method is called once
            ctx.succeed.should.be.calledOnce;
            
            done();
        });
    });
});
```

If the handler method is asynchronous, make sure it returns a promise. If you don't return
a promise, the test will fail. This is because the handler returns but at that moment, the
`succeed` method is not yet called.

## Contributors

- Sam Verschueren [<sam.verschueren@gmail.com>]

## License

MIT © Sam Verschueren
