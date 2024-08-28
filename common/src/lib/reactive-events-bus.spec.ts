import { test, expect, vi } from 'vitest';
import { BrokerBus, BrokerMemoryAdapter } from '@deepkit/broker';
import { Injector, provide } from '@deepkit/injector';
import { Logger } from '@deepkit/logger';
import { RestateContextStorage, RestateInMemoryContext } from 'deepkit-restate';

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
      useValue: () => ({ getStore: () => new RestateInMemoryContext() }),
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
