import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AUTH_SERVICE, LoggerModule } from '@app/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { IntrospectAndCompose, RemoteGraphQLDataSource } from '@apollo/gateway';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { authContext } from './auth.context';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LoggerModule,
    GraphQLModule.forRootAsync<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,
      useFactory: (configService: ConfigService) => ({
        /**
         * This define a function that will run each time a GQL request is made to our Gateway
         */
        server: {
          context: authContext,
        },
        gateway: {
          /**
           * we tell the graphql gateway where to find the supergraph schema (other microservices graphql schemas)
           * this will go and fetch all the schemas and merge them into one schema
           */
          supergraphSdl: new IntrospectAndCompose({
            subgraphs: [
              /**
               * Each item will have a:
               * 1. name: the name of the microservice
               * 2. url: the url of the microservice graphql endpoint to fetch the schema from
               */
              {
                name: 'reservations',
                url: configService.get<string>('RESERVATIONS_GRAPHQL_URL'),
              },
            ],
          }),
          /**
           * This function will be called before submitting the main request to the original microservice
           * it is used to modify or add headers to the request or even redirect it
           */
          buildService({ url }) {
            return new RemoteGraphQLDataSource({
              url,
              willSendRequest({ request, context }) {
                /**
                 * This will add the user record to the request headers
                 * so other microservices can use it
                 */
                request.http.headers.set(
                  'user',
                  context.user ? JSON.stringify(context.user) : null,
                );
              },
            });
          },
        },
      }),
      inject: [ConfigService],
    }),
    /**
     * Use TCP to make connection with other GraphQL microservices
     * this will allow us to use the Federation feature of the GraphQL
     */
    ClientsModule.registerAsync([
      {
        name: AUTH_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>('AUTH_SERVICE_HOST'),
            port: configService.get<number>('AUTH_SERVICE_PORT'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [],
  providers: [],
})
export class GatewayModule {}
