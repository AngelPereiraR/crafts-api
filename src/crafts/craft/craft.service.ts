import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Craft } from './craft.entity';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

@Injectable()
export class CraftService {
  constructor(
    @InjectRepository(Craft)
    private craftRepository: Repository<Craft>,
  ) {}

  async findAll(): Promise<Craft[]> {
    return this.craftRepository.find({
      order: {
        id: 'ASC',
      },
    });
  }

  async findOne(id: number): Promise<Craft> {
    return this.craftRepository.findOneBy({ id });
  }

  async create(craftData: Partial<Craft>): Promise<Craft> {
    const craft = this.craftRepository.create(craftData);
    await this.craftRepository.save(craft);
    return craft;
  }

  async update(id: number, craftData: Partial<Craft>): Promise<Craft> {
    await this.craftRepository.update(id, craftData);
    return this.craftRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.craftRepository.delete(id);
      
  }

  async uploadArchive(
    id: number,
    archive: UploadApiResponse | UploadApiErrorResponse,
  ): Promise<void> {
    const craft = await this.craftRepository.findOneBy({ id });
    if (!craft) {
      throw new NotFoundException(`Craft con id ${id} no encontrado`);
    }
    craft.url = archive.url;
    await this.craftRepository.save(craft);
  }
}
