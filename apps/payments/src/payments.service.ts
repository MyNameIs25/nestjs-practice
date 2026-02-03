import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import {
  NOTIFICATIONS_SERVICE_NAME,
  NotificationsServiceClient,
} from '@app/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { PaymentsCreateChargeDto } from './dto/payments-create-charge.dto';

@Injectable()
export class PaymentsService implements OnModuleInit {
  private readonly stripe: Stripe;
  private notificationsService: NotificationsServiceClient;
  constructor(
    private readonly configService: ConfigService,
    @Inject(NOTIFICATIONS_SERVICE_NAME)
    private readonly client: ClientGrpc,
  ) {
    const stripeSecretKey =
      this.configService.getOrThrow<string>('STRIPE_SECRET_KEY');

    this.stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2026-01-28.clover',
    });
  }

  onModuleInit() {
    console.log('PaymentsService onModuleInit called');
    this.notificationsService =
      this.client.getService<NotificationsServiceClient>(
        NOTIFICATIONS_SERVICE_NAME,
      );
    console.log('notificationsService initialized:', !!this.notificationsService);
  }

  async createCharge({
    token,
    amount,
    email,
  }: PaymentsCreateChargeDto): Promise<Stripe.PaymentIntent> {
    const paymentIntent = await this.stripe.paymentIntents.create({
      payment_method: token,
      amount: amount * 100,
      currency: 'usd',
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never',
      },
    });

    if (this.notificationsService) {
      this.notificationsService
        .notifyEmail({
          email,
          subject: 'Payment successful',
          text: `You have successfully paid $${amount} for your reservation.`,
        })
        .subscribe(() => {});
    }

    return paymentIntent;
  }
}
