import {restate, RestateServiceContext} from "deepkit-restate";
import {Consumer, ConsumerServiceApi, ConsumerServiceHandlers} from "@ftgo/consumer-service-api";
import {PersonName} from "@ftgo/shared";
import {UUID} from "@deepkit/type";

import {ConsumerRepository} from "./consumer.repository";

@restate.service<ConsumerServiceApi>()
export class ConsumerService implements ConsumerServiceHandlers {
  constructor(
    private readonly ctx: RestateServiceContext,
    private readonly consumerRepository: ConsumerRepository,
  ) {}

  async create(name: PersonName): Promise<UUID> {
    const consumer = await this.ctx.run<Consumer>(() => this.consumerRepository.create({ name }));
  }
}
