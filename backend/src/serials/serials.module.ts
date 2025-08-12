import { Module } from '@nestjs/common';
import { SerialsService } from './serials.service';
import { SerialsController } from './serials.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SerialsController],
  providers: [SerialsService],
  exports: [SerialsService],
})
export class SerialsModule {}