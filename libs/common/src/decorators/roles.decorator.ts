import { SetMetadata } from '@nestjs/common';

/**
 * Set metadata to the class (guards) this metadata can be fetched inside the guard using the reflector
 */
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
