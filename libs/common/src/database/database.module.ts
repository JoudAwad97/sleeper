import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      // allow us to run a code with dependency injection to initialize the module
      // Returned object should be a module configuration object
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.getOrThrow('DB_HOST'),
        port: configService.getOrThrow('DB_PORT'),
        username: configService.getOrThrow('DB_USERNAME'),
        password: configService.getOrThrow('MYSQL_ROOT_PASSWORD'),
        database: configService.getOrThrow('DB_DATABASE'),
        // do not use "synchronize" in production - otherwise you can lose production data
        synchronize: true,
        autoLoadEntities: true,
      }),
      // list of dependencies that are required to execute the factory function
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {
  static forFeature(models: EntityClassOrSchema[]) {
    return TypeOrmModule.forFeature(models);
  }
}
