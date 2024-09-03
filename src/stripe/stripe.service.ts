import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Stripe from 'stripe';
import { Subscription, Tipo } from 'src/subscription/entities/subscription.entity';
import { CreateCheckoutSessionDto } from './createCheckout.dto';


@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-06-20',
    });
  }

  async createCheckoutSession(createCheckoutSessionDto: CreateCheckoutSessionDto) {
    const {priceId, price, tipo} = createCheckoutSessionDto;
    // Crear una sesión de Checkout de Stripe
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTNEXO}/success`,
      cancel_url: `${process.env.FRONTNEXO}/cancel`,
    });

    // Verifica si la entidad Subscription tiene las propiedades correctas
    const newSubscription = this.subscriptionRepository.create({tipo, price});

    await this.subscriptionRepository.save(newSubscription);

    return session;
  }
}

