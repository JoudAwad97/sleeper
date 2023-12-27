import { NOTIFICATIONS_SERVICE } from '@app/common';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
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

  constructor(
    private readonly configService: ConfigService,
    @Inject(NOTIFICATIONS_SERVICE)
    private readonly notificationService: ClientProxy,
  ) {}

  async getPayments() {
    const payments = await this.stripe.paymentIntents.list();
    return payments.data;
  }

  async createCharge({ card, amount, email }: PaymentsCreateChargeDto) {
    const paymentMethod = await this.stripe.paymentMethods.create({
      type: 'card',
      card,
    });

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: amount * 100,
      currency: 'usd',
      payment_method: paymentMethod.id,
      confirm: true,
      payment_method_types: ['card'],
    });

    this.notificationService.emit('notify_email', {
      email,
      text: `Your payment of $${amount} was received`,
    });

    return paymentIntent;
  }
}
