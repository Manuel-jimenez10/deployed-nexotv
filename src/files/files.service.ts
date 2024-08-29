import { Injectable, BadRequestException } from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';
import { UsersService } from '../users/users.service';
import { UpdateUserInput } from 'src/users/dto/inputs';

@Injectable()
export class FilesService {
  constructor(private readonly usersService: UsersService) {}
  getStaticProductImage(imageUserId: string) {
    const path = join(__dirname, '../../static/imgUser', imageUserId);
    const pathTransform = path.split(':')[1].replaceAll('\\', '/');
    if (!existsSync(pathTransform)) {
      throw new BadRequestException(
        `Image with id: '${imageUserId}' doesn't exit`,
      );
    }

    return pathTransform;
  }

  async updateImgUser(updateImageUserDto: UpdateUserInput) {
    await this.usersService.update(updateImageUserDto.id, updateImageUserDto);
  }
}
