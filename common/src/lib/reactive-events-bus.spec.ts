import { test, expect, vi } from 'vitest';
import { BrokerBus, BrokerMemoryAdapter } from '@deepkit/broker';
import { Injector, provide } from '@deepkit/injector';
import { uuid, UUID } from '@deepkit/type';
import { Logger } from '@deepkit/logger';
import {
  RestateContextStorage,
  RestateInMemoryContextStorage,
} from 'deepkit-restate';

import {
  provideReactiveEventsBus,
  ReactiveEventsBus,
} from './reactive-events-bus';

test('subscribe', async () => {
  class TestEvent {}

  type TestEvents = TestEvent;

  type TestEventsBus = ReactiveEventsBus<TestEvents>;

  const injector = Injector.from([
    Logger,
    {
      provide: RestateContextStorage,
      useClass: RestateInMemoryContextStorage,
    },
    provide<BrokerBus>(() => new BrokerBus(new BrokerMemoryAdapter())),
    provideReactiveEventsBus<TestEventsBus>(),
  ]);

  const events = injector.get<TestEventsBus>();

  const observable = await events.subscribe<TestEvent>();

  const subscriber = vi.fn();

  observable.subscribe(subscriber);

  const event = new TestEvent();

  await events.publish(event);

  expect(subscriber).toHaveBeenCalledTimes(1);
  expect(subscriber).toHaveBeenCalledWith(event);
});

test('classes without discriminators', async () => {
  class FirstEvent {
    readonly id: UUID = uuid();
  }

  class SecondEvent {
    readonly id: UUID = uuid();
  }

  type TestEvents = FirstEvent | SecondEvent;

  type TestEventsBus = ReactiveEventsBus<TestEvents>;

  const injector = Injector.from([
    Logger,
    {
      provide: RestateContextStorage,
      useClass: RestateInMemoryContextStorage,
    },
    provide<BrokerBus>(() => new BrokerBus(new BrokerMemoryAdapter())),
    provideReactiveEventsBus<TestEventsBus>(),
  ]);

  const events = injector.get<TestEventsBus>();

  const observable = await events.subscribe<FirstEvent>();

  const subscriber = vi.fn();

  observable.subscribe(subscriber);

  const event = new SecondEvent();

  await events.publish(event);

  expect(subscriber).not.toHaveBeenCalled();
});
