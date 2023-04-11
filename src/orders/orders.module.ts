import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItem } from './entities/orderItem.entity';
import { Order } from './entities/order.entity';
import { OrderStatus } from './entities/orderStatus.entity';
import { OrderService } from './services/order.service';
import { OrderItemService } from './services/orderItem.service';
import { OrderStatusService } from './services/orderStatus.service';
import { OrderController } from './controllers/order.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { SharedModule } from '../shared/shared.module';
import { OrderItemController } from './controllers/orderItem.controller';
import { TicketModule } from '../ticket/ticket.module';

@Module({
  imports: [
    CqrsModule,
    SharedModule,
    TicketModule,
    TypeOrmModule.forFeature([OrderItem, Order, OrderStatus]),
  ],
  providers: [OrderService, OrderItemService, OrderStatusService],
  controllers: [OrderController, OrderItemController],
  exports: [],
})
export class OrdersModule {}
