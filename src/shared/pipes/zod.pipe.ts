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
        error.errors.map(
          (errItem: { message: string; path: string[] }) =>
            `${errItem.message} ${errItem.path
              .map((pathItem) => pathItem.split('_').join(' '))
              .join(', ')}`,
        ),
      );
    }
    return value;
  }
}
