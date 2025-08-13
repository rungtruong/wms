import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ContractsModule } from './contracts/contracts.module';
import { ProductsModule } from './products/products.module';

import { TicketsModule } from './tickets/tickets.module';
import { WarrantyHistoryModule } from './warranty-history/warranty-history.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { NotificationsModule } from './notifications/notifications.module';
import { CustomerPortalModule } from './customer-portal/customer-portal.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    ContractsModule,
    ProductsModule,
    TicketsModule,
    WarrantyHistoryModule,
    DashboardModule,
    NotificationsModule,
    CustomerPortalModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}