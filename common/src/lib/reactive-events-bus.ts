import { Observable, Subject } from 'rxjs';
import { BrokerBus, BrokerBusChannel } from '@deepkit/broker';
import { provide } from '@deepkit/injector';
import { Logger, ScopedLogger } from '@deepkit/logger';
import { RestateContextStorage } from 'deepkit-restate';
import {
  getClassType,
  ReceiveType,
  resolveReceiveType,
  TypeClass,
} from '@deepkit/type';

export function provideReactiveEventsBus<T extends ReactiveEventsBus<unknown>>(
  type?: ReceiveType<T>,
) {
  type = resolveReceiveType(type!) as TypeClass;
  const eventsType = type.arguments![0];
  return provide(
    (logger: Logger, contextStorage: RestateContextStorage, bus: BrokerBus) =>
      new ReactiveEventsBus(
        logger.scoped('ReactiveEventsBus'),
        contextStorage,
        bus.channel(eventsType.typeName!, eventsType),
      ),
    type,
  );
}

export class ReactiveEventsBus<Events> {
  constructor(
    private readonly logger: ScopedLogger,
    private readonly contextStorage: RestateContextStorage,
    private readonly channel: BrokerBusChannel<Events>,
  ) {}

  async publish<T extends Events>(event: T): Promise<void> {
    const ctx = this.contextStorage.getStore()!;
    await ctx.run(async () => {
      this.logger.log('Publishing event:', event);
      await this.channel.publish(event);
    });
  }

  async subscribe<T extends Events>(
    type?: ReceiveType<T>,
  ): Promise<Observable<T>> {
    const classType = getClassType(resolveReceiveType(type!));
    const events = new Subject<T>();

    const unsubscribe = await this.channel.subscribe(event => {
      if (event instanceof classType) {
        this.logger.log('Received event:', event);
        events.next(event as T);
      }
    });

    return new Observable<T>(subscriber => {
      subscriber.add(unsubscribe);
      events.subscribe(subscriber);
    });
  }
}
