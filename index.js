'use strict';

/**
 * This exported function generates a new context object that can be used
 * for mocking purposes when testing a lambda function in NodeJS.
 * 
 * @author Sam Verschueren      <sam.verschueren@gmail.com>
 * @since  27 Jul. 2015
 */

// module dependencies
var uuid = require('node-uuid'),
    moment = require('moment'),
    pkg = require('./package.json');

// Export a function that creates a new context
module.exports = function() {
    // Calculate some id's
    var id = uuid.v1(),
        stream = uuid.v4().replace(/-/g, '');
    
    // Return the new object
    return {
        awsRequestId: id,
        invokeid: id,
        logGroupName: '/aws/lambda/' + pkg.name,
        logStreamName: moment().format('YYYY/MM/DD') + '/[HEAD]' + stream,
        functionName: pkg.name,
        memoryLimitInMB: '128',
        functionVersion: 'HEAD',
        isDefaultFunctionVersion: true,
        succeed: function(result) {},
        fail: function(err) {},
        done: function(err, result) {
            if(err) {
                return this.fail(err);
            }
            
            this.succeed(result);
        },
        getRemainingTimeInMillis: function() {
            // Generate random value between 100 and 3000
            return Math.floor(Math.random() * (3000 - 100)) + 100;
        }
    };
};