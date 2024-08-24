import { entity } from '@deepkit/type';

@entity.name('@error/unsupported-state-transition-exception')
export class UnsupportedStateTransitionException extends Error {}
