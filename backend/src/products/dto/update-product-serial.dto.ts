import { PartialType } from '@nestjs/mapped-types';
import { CreateProductSerialDto } from './create-product-serial.dto';

export class UpdateProductSerialDto extends PartialType(CreateProductSerialDto) {}