import { Unique } from '@deepkit/type';

export interface PersonName {
  readonly firstName: string;
  readonly lastName: string;
}

export interface Address {
  readonly street1: string;
  readonly street2?: string;
  readonly city: string;
  readonly state?: string;
  readonly zip: string;
}
