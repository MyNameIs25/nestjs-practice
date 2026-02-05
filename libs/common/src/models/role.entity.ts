import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../database';
import { Directive, Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Directive('@shareable')
@Entity()
export class Role extends AbstractEntity<Role> {
  @Column()
  @Field()
  name: string;
}
