import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NOTIFICATIONS_SERVICE } from '@app/common';
import { ApolloDriverConfig, ApolloFederationDriver } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { PaymentResolver } from './payment.resolver';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LoggerModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: {
        federation: 2,
      },
    }),
    ClientsModule.registerAsync([
      {
        name: NOTIFICATIONS_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            port: configService.get('NOTIFICATION_TCP_PORT'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService, PaymentResolver],
})
export class PaymentsModule {}
