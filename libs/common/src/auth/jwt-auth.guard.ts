import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { ClientGrpc } from '@nestjs/microservices';
import { Reflector } from '@nestjs/core';
import { AUTH_SERVICE_NAME, AuthServiceClient } from '../types';

@Injectable()
export class JwtAuthGuard implements CanActivate, OnModuleInit {
  private readonly logger = new Logger(JwtAuthGuard.name);
  private authService: AuthServiceClient;

  /**
   * allow us to communicate with other microservices through a TCP connection.
   * used for microservices communication
   */
  constructor(
    @Inject(AUTH_SERVICE_NAME) private readonly client: ClientGrpc,
    private readonly reflector: Reflector,
  ) {}

  onModuleInit() {
    this.authService =
      this.client.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const jwt = context.switchToHttp().getRequest().cookies['Authentication'];

    if (!jwt) {
      return false;
    }

    /**
     * Get the metadata from the class, those metadata are added through the "SetMetadata" which is used in the "@Roles" decorator
     */
    const roles = this.reflector.get<string[]>('roles', context.getClass());

    /**
     * This will send a request to the authentication service using the TCP connection through the microservices packages
     * then we listen to the response using the RxJS operators
     * then we set the user in the request object
     */
    this.authService
      .authenticate({
        Authentication: jwt,
      })
      .pipe(
        tap((res) => {
          /**
           * Check that we have roles assigned to this route
           * if we have
           * - loop through the roles and check if the user has the required role to access this endpoint
           * - in case "NOT" throw an error of unauthorized
           */
          if (roles) {
            for (const role of roles) {
              if (!res.roles.includes(role)) {
                this.logger.error(
                  `User ${res.email} is not allowed to access this route`,
                );
                throw new UnauthorizedException();
              }
            }
          }

          context.switchToHttp().getRequest().user = {
            ...res,
            _id: res.id,
          };
        }),
        map(() => true),
        catchError((err) => {
          this.logger.error(err);
          return of(false);
        }),
      );
  }
}
