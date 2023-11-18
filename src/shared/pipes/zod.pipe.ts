import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ZodObject } from 'zod';

@Injectable()
export class ZodPipe implements PipeTransform {
  constructor(private schema: ZodObject<any>) {}

  transform(value: unknown) {
    try {
      this.schema.parse(value);
    } catch (error) {
      throw new BadRequestException(
        `Validation failed: ${error.errors.join('\n')}`,
      );
    }
    return value;
  }
}
