import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  NOTIFICATIONS_PACKAGE_NAME,
  NOTIFICATION_SERVICE_NAME,
} from '@app/common';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LoggerModule,
    ClientsModule.registerAsync([
      {
        name: NOTIFICATION_SERVICE_NAME,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            protoPath: join(__dirname, '../../../proto/notifications.proto'),
            package: NOTIFICATIONS_PACKAGE_NAME,
            url: configService.getOrThrow('NOTIFICATIONS_GRPC_URL'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
