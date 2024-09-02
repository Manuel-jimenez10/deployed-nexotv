import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Subscription, Tipo } from './entities/subscription.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SubscriptionService{
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
  ) {}

  async defaultSubscription(): Promise<Subscription> {
    // Buscar una suscripción predeterminada existente
    let defaultSubscription = await this.subscriptionRepository.findOne({
      where: { tipo: Tipo.Free },
    });

    // Si no existe, crear una nueva
    if (!defaultSubscription) {
      defaultSubscription = this.subscriptionRepository.create({
        tipo: Tipo.Free,
        price: 0,
      });
      await this.subscriptionRepository.save(defaultSubscription);
    }

    return defaultSubscription;
  }
 }

