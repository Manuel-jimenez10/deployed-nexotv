import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeResolver } from './stripe.resolver';
import { Subscription } from 'src/subscription/entities/subscription.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionModule } from 'src/subscription/subscription.module';

@Module({
  providers: [StripeService, StripeResolver],
  imports: [TypeOrmModule.forFeature([Subscription]), SubscriptionModule]
})
export class StripeModule {}
