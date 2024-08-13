import { float } from '@deepkit/type';

export class Money {
  static ZERO = new Money(0);

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

  multiply(other: Money): Money {
    return new Money(this.amount * other.amount);
  }
}
