import { Injectable, NestMiddleware } from '@nestjs/common';
import { AuthRequest } from 'src/interface/AuthRequest';

@Injectable()
export class AuthParserMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    try {
      const user = JSON.parse(req.headers['x-user-info'] as string);

      (req as AuthRequest).user = user
    } catch (_) {
        // no authentication data
    }
    next()
  }
}
