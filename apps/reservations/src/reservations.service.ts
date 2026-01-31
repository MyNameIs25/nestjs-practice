import { Inject, Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationsRepository } from './reservations.repository';
import { PAYMENTS_SERVICE } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ReservationsService {
  constructor(
    private readonly reservationsRepository: ReservationsRepository,
    @Inject(PAYMENTS_SERVICE) private readonly paymentsService: ClientProxy,
  ) {}

  async create(createReservationDto: CreateReservationDto, userId: string) {
    const response = await firstValueFrom(
      this.paymentsService.send('create_charge', createReservationDto.charge),
    );
    if (!response) {
      throw new Error('Failed to create charge');
    }
    return this.reservationsRepository.create({
      ...createReservationDto,
      invoiceId: response.id,
      timestamp: new Date(),
      userId,
    });
  }

  async findAll() {
    return this.reservationsRepository.find({});
  }

  async findOne(id: string) {
    return this.reservationsRepository.findOne({ _id: id });
  }

  async update(id: string, updateReservationDto: UpdateReservationDto) {
    return this.reservationsRepository.findOneAndUpdate(
      { _id: id },
      { $set: updateReservationDto },
    );
  }

  async remove(id: string) {
    return this.reservationsRepository.findOneAndDelete({ _id: id });
  }
}
