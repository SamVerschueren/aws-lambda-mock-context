import {Context} from 'aws-lambda';

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

type MockInitialize = (options?: ContextOptions) => MockContext;

declare const mockContext: MockInitialize;

export = mockContext;
