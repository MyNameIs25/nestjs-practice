import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Reservation } from './models/reservation.entity';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { CurrentUser, User } from '@app/common';
import { UpdateReservationDto } from './dto/update-reservation.dto';

@Resolver(() => Reservation)
export class ReservationsResolver {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Mutation(() => Reservation)
  async createReservation(
    @Args('createReservationInput')
    createReservationInput: CreateReservationDto,
    @CurrentUser() user: User,
  ) {
    return this.reservationsService.create(createReservationInput, user);
  }

  @Query(() => [Reservation], { name: 'reservations' })
  async findAll() {
    return this.reservationsService.findAll();
  }

  @Query(() => Reservation, { name: 'reservation' })
  async findOne(@Args('id', { type: () => Number }) id: number) {
    return this.reservationsService.findOne(id);
  }

  @Mutation(() => Reservation)
  async updateReservation(
    @Args('id', { type: () => Number }) id: number,
    @Args('updateReservationInput')
    updateReservationInput: UpdateReservationDto,
  ) {
    return this.reservationsService.update(id, updateReservationInput);
  }

  @Mutation(() => Reservation)
  async removeReservation(@Args('id', { type: () => Number }) id: number) {
    return this.reservationsService.remove(id);
  }
}
