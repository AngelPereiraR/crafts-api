import { Module, forwardRef } from '@nestjs/common';
import { CraftService } from './craft/craft.service';
import { CraftController } from './craft/craft.controller';
import { AuthGuard } from '../guards/auth.guard';
import { Craft } from './craft/craft.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Craft]),
    CloudinaryModule
  ],
  providers: [CraftService, AuthGuard],
  controllers: [CraftController],
  exports: [CraftService]
})
export class CraftModule {}
