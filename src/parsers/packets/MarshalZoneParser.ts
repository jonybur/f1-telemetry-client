import {F1Parser} from '../F1Parser';

export class MarshalZoneParser extends F1Parser {
  constructor() {
    super();
    (this as any).endianess('little').floatle('m_zoneStart').int8('m_zoneFlag');
  }
}
