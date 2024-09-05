import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { Subscription } from './entities/subscription.entity';
import { SubscriptionService } from './subscription.service';
import { UpdateSubscriptionInput } from './dto/update-subscription.input';
import { User } from 'src/users/entities/user.entity';

@Resolver(() => Subscription)
export class SubscriptionResolver {
  constructor(
    private readonly subscriptionService: SubscriptionService,
  ) {}

  @Query(() => Subscription)
  async defaultSubscription(@Args('id') id: string): Promise<Subscription> {
    return this.subscriptionService.defaultSubscription(id);
  }

  @Mutation(() => Subscription)
  async updateSubscription(
    @Args('updateSubscriptionInput') id: string,
    @Args('updateSubscriptionInput') updateSubscriptionInput: UpdateSubscriptionInput
  ): Promise<Subscription> {
    return this.subscriptionService.update(id, updateSubscriptionInput);
  }
}
