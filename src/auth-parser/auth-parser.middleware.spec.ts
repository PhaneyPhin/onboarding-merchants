import { AuthParserMiddleware } from './auth-parser.middleware';

describe('AuthParserMiddleware', () => {
  it('should be defined', () => {
    expect(new AuthParserMiddleware()).toBeDefined();
  });
});
