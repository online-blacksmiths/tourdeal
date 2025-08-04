import { Exclude } from 'class-transformer';
import { Column, Entity, Index } from 'typeorm';

import { BaseEntity } from './base.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ length: 100, nullable: true })
  @Index({ unique: true })
  email: string;

  @Column({ length: 255 })
  @Exclude()
  password: string;

  @Column({ length: 100, nullable: true })
  @Index({ unique: true })
  nickname: string;
}
