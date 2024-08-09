import {RestateService} from "deepkit-restate";
import {UUID} from "@deepkit/type";

import {PersonName} from "@ftgo/shared";

export interface ConsumerServiceHandlers {
  create(name: PersonName): Promise<UUID>;
}

export type ConsumerServiceApi = RestateService<'consumer', ConsumerServiceHandlers>;
