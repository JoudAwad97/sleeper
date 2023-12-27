import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from '@app/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { IntrospectAndCompose } from '@apollo/gateway';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LoggerModule,
    GraphQLModule.forRootAsync<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,
      useFactory: (configService: ConfigService) => ({
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
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [],
})
export class GatewayModule {}
