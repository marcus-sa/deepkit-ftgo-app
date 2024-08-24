import { float, integer, Positive, UUID } from '@deepkit/type';

export class Money {
  static ZERO = new Money(0);
  static MAX = new Money(Number.MAX_SAFE_INTEGER);

  get cents(): number {
    return this.amount * 100;
  }

  constructor(readonly amount: float) {}

  add(delta: Money): Money {
    return new Money(this.amount + delta.amount);
  }

  isGreaterThanOrEqual(other: Money): boolean {
    return this.amount >= other.amount;
  }

  equals(other: Money): boolean {
    return this === other || this.amount === other.amount;
  }

  multiply(amount: float): Money {
    return new Money(this.amount * amount);
  }
}

export class RevisedOrderLineItem {
  constructor(
    readonly quantity: integer & Positive,
    readonly menuItemId: UUID,
  ) {}
}
