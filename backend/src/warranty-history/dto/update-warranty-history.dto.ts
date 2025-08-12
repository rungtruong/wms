import { PartialType } from '@nestjs/mapped-types';
import { CreateWarrantyHistoryDto } from './create-warranty-history.dto';

export class UpdateWarrantyHistoryDto extends PartialType(CreateWarrantyHistoryDto) {}