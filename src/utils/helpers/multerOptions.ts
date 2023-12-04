import { ParseFilePipeBuilder } from '@nestjs/common';
// import { CustomFileTypeValidator } from './customFileTypeValidator';

// 8 MB = 8 * 1024 * 1024 = 8388608 bytes

export const fileValidation = new ParseFilePipeBuilder()
  .addMaxSizeValidator({
    maxSize: 8388608,
    message: 'Apenas imagens de até 8MB são permitidas!',
  })
  // .addValidator(
  //   new CustomFileTypeValidator({
  //     fileType: ['image/jpeg', 'image/png'],
  //   }),
  // )
  .build({
    fileIsRequired: true,
  });
