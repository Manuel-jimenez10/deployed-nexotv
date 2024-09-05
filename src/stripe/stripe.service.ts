import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Stripe from 'stripe';
import { Subscription, Tipo } from 'src/subscription/entities/subscription.entity';
import { CreateCheckoutSessionDto } from './createCheckout.dto';
import { UsersService } from 'src/users/users.service';
import { SubscriptionService } from 'src/subscription/subscription.service';


@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
    private readonly usersServices: UsersService,
    private readonly subscriptionService: SubscriptionService
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-06-20',
    });
  }
  async createCheckoutSession(createCheckoutSessionDto: CreateCheckoutSessionDto) {
    const { priceId, price, tipo, userId } = createCheckoutSessionDto;
  
    // Crea una sesión de Checkout de Stripe
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
  
    console.log(userId);
  
    // Obtiene el usuario
    const user = await this.usersServices.findOneById(userId);
    console.log(user);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
  
    // Verifica si el usuario tiene una suscripción
    if (!user.subscription || !user.subscription.id) {
      throw new Error('Suscripción del usuario no encontrada');
    }
    
    console.log(user.subscription.id);
    
    // Obtiene la suscripción
    const subscription = await this.subscriptionService.findOneBySubscriptionId(user.subscription.id);
    console.log(subscription.id);
    if (!subscription || !subscription.id) {
      throw new Error('Suscripción no encontrada');
    }

    
  
    // Actualiza la suscripción
    await this.subscriptionService.update(subscription.id, { tipo, price });
  
    return session;
  }
}  