import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { CreateChargeDto } from '../../../libs/common/src/dto/create-charge.dto';

@Injectable()
export class PaymentsService {
  private readonly stripe: Stripe;
  constructor(private readonly configService: ConfigService) {
    const stripeSecretKey =
      this.configService.getOrThrow<string>('STRIPE_SECRET_KEY');

    this.stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2025-12-15.clover',
    });
  }

  async createCharge({
    token,
    amount,
  }: CreateChargeDto): Promise<Stripe.PaymentIntent> {
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

    return paymentIntent;
  }
}
