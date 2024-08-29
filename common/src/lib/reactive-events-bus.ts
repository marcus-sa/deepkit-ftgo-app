import { Observable, Subject } from 'rxjs';
import { BrokerBus, BrokerBusChannel } from '@deepkit/broker';
import { provide } from '@deepkit/injector';
import { Logger, ScopedLogger } from '@deepkit/logger';
import { RestateContextStorage } from 'deepkit-restate';
import { ClassType } from '@deepkit/core';
import {
  assertType,
  getClassType,
  ReceiveType,
  ReflectionKind,
  resolveReceiveType,
  TypeClass,
  TypeUnion,
} from '@deepkit/type';

export function provideReactiveEventsBus<T extends ReactiveEventsBus<unknown>>(
  type?: ReceiveType<T>,
) {
  type = resolveReceiveType(type) as TypeClass;
  const eventsType = type.arguments![0] as TypeUnion | TypeClass;
  if (
    eventsType.kind !== ReflectionKind.class &&
    eventsType.kind !== ReflectionKind.union
  ) {
    throw new Error('Type argument must be a class or union');
  }
  const eventTypes =
    eventsType.kind === ReflectionKind.class ? [eventsType] : eventsType.types;

  return provide(
    (logger: Logger, contextStorage: RestateContextStorage, bus: BrokerBus) => {
      const channels = new Map<ClassType, BrokerBusChannel<unknown>>();
      for (const eventType of eventTypes) {
        assertType(eventType, ReflectionKind.class);
        channels.set(
          eventType.classType,
          bus.channel(eventType.typeName!, eventType),
        );
      }
      return new ReactiveEventsBus(
        logger.scoped('ReactiveEventsBus'),
        contextStorage,
        channels,
      );
    },
    type,
  );
}

export class ReactiveEventsBus<Events> {
  constructor(
    private readonly logger: ScopedLogger,
    private readonly contextStorage: RestateContextStorage,
    private readonly channels: Map<ClassType, BrokerBusChannel<Events>>,
  ) {}

  #getChannel<T extends Events>(classType: ClassType): BrokerBusChannel<T> {
    const channel = this.channels.get(classType);
    if (!channel) {
      throw new Error('Missing channel for class type: ' + classType.name);
    }
    return channel as BrokerBusChannel<T>;
  }

  async publish<T extends Events>(event: T): Promise<void> {
    const ctx = this.contextStorage.getStore()!;
    await ctx.run(async () => {
      this.logger.log('Publishing event:', event);
      const channel = this.#getChannel<T>((event as any).constructor);
      await channel.publish(event);
    });
  }

  async subscribe<T extends Events>(
    type?: ReceiveType<T>,
  ): Promise<Observable<T>> {
    const classType = getClassType(resolveReceiveType(type));
    const events = new Subject<T>();

    const channel = this.#getChannel<T>(classType);

    const unsubscribe = await channel.subscribe(event => {
      this.logger.log('Received event:', event);
      events.next(event as T);
    });

    return new Observable<T>(subscriber => {
      subscriber.add(unsubscribe);
      events.subscribe(subscriber);
    });
  }
}
