import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { CreateChargeMessage } from '../types';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateChargeDto implements Omit<CreateChargeMessage, 'email'> {
  @IsNotEmpty()
  @IsString()
  @Field()
  token: string;

  @IsNotEmpty()
  @IsNumber()
  @Field()
  amount: number;
}
