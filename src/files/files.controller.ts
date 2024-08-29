import {
  BadRequestException,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter, fileNamer } from './helpers';
import { diskStorage } from 'multer';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
  ) {}

  @Get('user/:userImgId')
  findOne(@Res() res: Response, @Param('userImgId') userImgId: string) {
    const path = this.filesService.getStaticProductImage(userImgId);
    res.sendFile(path);
  }

  @Post('user/:userId')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter,
      limits: { fileSize: 20000000 },
      storage: diskStorage({
        destination: './static/imgUser',
        filename: fileNamer,
      }),
    }),
  )
  uploadUserImage(
    @Param('userId', ParseUUIDPipe) userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file)
      throw new BadRequestException('Make sure that the argument is an image');

    const secureUrl: string = `${this.configService.get('HOST_API')}/files/user/${file.filename}`;

    this.filesService.updateImgUser({ id: userId, userImage: [secureUrl] });

    return {
      secureUrl,
    };
  }
}
