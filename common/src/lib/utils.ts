import { Type, TypeClass } from '@deepkit/type';

export function addTypeClassArgument(
  origin: TypeClass,
  index: number,
  argument: Type,
) {
  if (!origin.arguments) {
    throw new Error(
      `Class ${origin.typeName} does not accept any type arguments`,
    );
  }
  origin.arguments![index] = argument;
}
