import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { Payload } from '@nestjs/microservices';
import { NotifyEmailDto } from './dto/notify-email.dto';
import {
  NotificationServiceController,
  NotificationServiceControllerMethods,
} from '@app/common';

@Controller()
@NotificationServiceControllerMethods()
export class NotificationsController implements NotificationServiceController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @UsePipes(new ValidationPipe())
  async notifyEmail(@Payload() data: NotifyEmailDto) {
    this.notificationsService.notifyEmail(data);
  }
}
