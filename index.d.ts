import { Context } from 'aws-lambda';

interface ContextOptions {
	region?: string;
	account?: string;
	alias?: string;
	functionName?: string;
	functionVersion?: string;
	memoryLimitInMB?: string;
	timeout?: number;
}

interface MockContext extends Context {
	Promise: Promise<any>;
}

declare var mockContext: {
	(options?: ContextOptions): MockContext;
};

export = mockContext;
