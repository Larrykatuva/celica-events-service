import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItem } from './entities/orderItem.entity';
import { Order } from './entities/order.entity';
import { OrderStatus } from './entities/orderStatus.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderItem, Order, OrderStatus])],
  providers: [],
  controllers: [],
  exports: [],
})
export class OrdersModule {}
