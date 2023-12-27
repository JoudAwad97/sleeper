import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ReservationDocument } from './models/reservation.schema';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { CurrentUser, UserDto } from '@app/common';

@Resolver(() => ReservationDocument)
export class ReservationsResolver {
  constructor(private readonly reservationService: ReservationsService) {}

  @Mutation(() => ReservationDocument)
  async createReservation(
    @Args('createReservationInput')
    createReservationInput: CreateReservationDto,
    @CurrentUser() user: UserDto,
  ) {
    return this.reservationService.create(createReservationInput, user);
  }

  @Query(() => [ReservationDocument], { name: 'reservations' })
  findAll() {
    return this.reservationService.findAll();
  }

  @Query(() => ReservationDocument, { name: 'reservation' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.reservationService.findOne(id);
  }

  @Mutation(() => ReservationDocument)
  removeReservation(@Args('id', { type: () => String }) id: string) {
    return this.reservationService.remove(id);
  }
}
