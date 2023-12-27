import { AUTH_SERVICE } from '@app/common';
import { UnauthorizedException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { app } from './app';
import { lastValueFrom } from 'rxjs';

/**
 * This function will be called each time a GQL request is made to our Gateway
 * it will make a call to the authentication microservice to authenticate the user
 * and return the user record if it exists
 */
export const authContext = async ({ req }) => {
  try {
    const authClient = app.get<ClientProxy>(AUTH_SERVICE);
    const user = await lastValueFrom(
      authClient.send('authenticate', {
        Authentication: req.headers?.authorization,
      }),
    );
    return { user };
  } catch (err) {
    throw new UnauthorizedException(err);
  }
};
