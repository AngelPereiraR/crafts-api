import { Controller, Get, Post, Body, Param, Patch, Delete, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CraftService } from './craft.service';
import { Craft } from './craft.entity';
import { AuthGuard } from '../../guards/auth.guard';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Controller('crafts')
export class CraftController {
  constructor(private readonly craftService: CraftService, private cloudinary: CloudinaryService) {}

  @Get()
  findAll(): Promise<Craft[]> {
    return this.craftService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Craft> {
    return this.craftService.findOne(parseInt(id, 10));
  }

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() craftData: Craft): Promise<Craft> {
    return this.craftService.create(craftData);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async update(@Param('id') id: string, @Body() craftData: Craft): Promise<Craft> {
    return this.craftService.update(parseInt(id, 10), craftData);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string): Promise<void> {
    return this.craftService.remove(parseInt(id, 10));
  }

  @Post('uploadImage/:id')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@Param('id') id: string, @UploadedFile() archive: Express.Multer.File) {
    return await this.cloudinary
      .uploadArchive(archive, 'image')
      .then((data) => {
        return this.craftService.uploadArchive(parseInt(id, 10), data);
      })
      .catch((err) => {
        return {
          statusCode: 400,
          message: err.message,
        };
      });
  }
}
