import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Craft {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @Column({default: ''})
  url: string; // Se almacenará la imagen en formato base64
}
