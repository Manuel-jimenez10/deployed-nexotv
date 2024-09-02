import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { StripeService } from './stripe.service';
import { CreateCheckoutSessionDto } from './createCheckout.dto';

@Resolver()
export class StripeResolver {
  constructor(private readonly stripeService: StripeService) {}

  @Mutation(() => String) // Define el tipo de retorno, en este caso un ID de sesión (string)
  async createCheckoutSession(@Args('createCheckoutSessionDto') createCheckoutSessionDto: CreateCheckoutSessionDto): Promise<string> {
    const session = await this.stripeService.createCheckoutSession(createCheckoutSessionDto);
    return session.id; // Retorna el ID de la sesión de Stripe
  }
}