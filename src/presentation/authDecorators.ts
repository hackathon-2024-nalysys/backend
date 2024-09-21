import { applyDecorators, SetMetadata } from '@nestjs/common';

export const Unauthorized = () => SetMetadata('unauthorized', true);
