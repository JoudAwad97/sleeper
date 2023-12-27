import {
  NOTIFICATIONS_SERVICE,
  NOTIFICATION_SERVICE_NAME,
  NotificationServiceClient,
} from '@app/common';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientGrpc } from '@nestjs/microservices';
import Stripe from 'stripe';
import { PaymentsCreateChargeDto } from './dto/payments-create-charge.dto';

@Injectable()
export class PaymentsService {
  // you aint getting my stripe key
  private readonly stripe = new Stripe(
    this.configService.get('STRIPE_SECRET_KEY'),
    {
      apiVersion: '2023-10-16',
    },
  );
  private notificationService: NotificationServiceClient;

  constructor(
    private readonly configService: ConfigService,
    @Inject(NOTIFICATIONS_SERVICE)
    private readonly client: ClientGrpc,
  ) {}

  async createCharge({ card, amount, email }: PaymentsCreateChargeDto) {
    const paymentMethod = await this.stripe.paymentMethods.create({
      type: 'card',
      card: {
        cvc: card.cvc,
        exp_month: card.expMonth,
        exp_year: card.expYear,
        number: card.number,
      },
    });

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: amount * 100,
      currency: 'usd',
      payment_method: paymentMethod.id,
      confirm: true,
      payment_method_types: ['card'],
    });

    // putting this example here to prove that we can do this in runtime not only during initailization
    if (!this.notificationService) {
      this.notificationService =
        this.client.getService<NotificationServiceClient>(
          NOTIFICATION_SERVICE_NAME,
        );
    }

    this.notificationService
      .notifyEmail({
        email,
        text: `Your payment of $${amount} was received`,
      })
      .subscribe(() => {});

    return paymentIntent;
  }
}
