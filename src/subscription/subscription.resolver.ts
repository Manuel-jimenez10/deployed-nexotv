import { Resolver} from '@nestjs/graphql';
import { SubscriptionService } from './subscription.service';
import { Subscription } from './entities/subscription.entity';

@Resolver(() => Subscription)
export class SubscriptionResolver {
  constructor(private readonly subscriptionService: SubscriptionService) {}
}
