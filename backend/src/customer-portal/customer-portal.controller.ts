import {
  Controller,
  Get,
  Post,
  Body,
  Param,
} from '@nestjs/common';
import { CustomerPortalService } from './customer-portal.service';
import { CreateSupportRequestDto } from './dto/create-support-request.dto';

@Controller('customer-portal')
export class CustomerPortalController {
  constructor(private readonly customerPortalService: CustomerPortalService) {}

  @Get('overview/:customerEmail')
  getCustomerOverview(@Param('customerEmail') customerEmail: string) {
    return this.customerPortalService.getCustomerOverview(customerEmail);
  }

  @Get('warranty-history/:customerEmail')
  getWarrantyHistory(@Param('customerEmail') customerEmail: string) {
    return this.customerPortalService.getWarrantyHistory(customerEmail);
  }

  @Post('support-request')
  createSupportRequest(@Body() createSupportRequestDto: CreateSupportRequestDto) {
    return this.customerPortalService.createSupportRequest(createSupportRequestDto);
  }
}