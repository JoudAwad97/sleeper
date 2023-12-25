import { AuthGuard } from '@nestjs/passport';

/**
 * the "AuthGuard('local')" has a "local" in it which should match the strategy name we defined in the local.strategy.ts file.
 * this is how to connect a guard to a strategy in nestjs
 */
export class LocalAuthGuard extends AuthGuard('local') {}
