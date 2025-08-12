import { Module } from '@nestjs/common';
import { WarrantyHistoryService } from './warranty-history.service';
import { WarrantyHistoryController } from './warranty-history.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [WarrantyHistoryController],
  providers: [WarrantyHistoryService],
  exports: [WarrantyHistoryService],
})
export class WarrantyHistoryModule {}