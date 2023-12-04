import { FileValidator } from '@nestjs/common';

export interface CustomFileTypeValidatorOptions {
  fileType: string[];
}

export class CustomFileTypeValidator extends FileValidator {
  private allowedMimeTypes: string[] = ['image/jpeg', 'image/png'];

  constructor(
    protected readonly validationOptions: CustomFileTypeValidatorOptions,
  ) {
    super(validationOptions);
    this.allowedMimeTypes = this.validationOptions.fileType;
  }

  public isValid(file?: Express.Multer.File): boolean {
    // const EXTENSIONS_REGEX = /.(jpg|jpeg|png)$/;

    // if (!EXTENSIONS_REGEX.test(file.originalname)) return false;

    if (!this.allowedMimeTypes.includes(file.mimetype)) return false;

    return true;
  }

  public buildErrorMessage(): string {
    return `Apenas imagens ${this.allowedMimeTypes.join(', ')} são permitidas!`;
  }
}
