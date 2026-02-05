import { Directive, Field, ObjectType } from '@nestjs/graphql';
import { PrimaryGeneratedColumn } from 'typeorm';

@ObjectType({ isAbstract: true })
@Directive('@shareable')
export class AbstractEntity<T> {
  @PrimaryGeneratedColumn()
  @Field()
  id: number;

  constructor(entity: Partial<T>) {
    Object.assign(this, entity);
  }
}
