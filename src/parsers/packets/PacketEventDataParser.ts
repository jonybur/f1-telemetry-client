import {Parser} from 'binary-parser';

import {EVENT_CODES} from '../../constants';
import {F1Parser} from '../F1Parser';

import {PacketHeaderParser} from './PacketHeaderParser';
import {PacketEventData} from './types';

export class PacketEventDataParser extends F1Parser {
  data: PacketEventData;

  constructor(buffer: Buffer, packetFormat: number) {
    super();

    this.endianess('little').nest('m_header', {type: new PacketHeaderParser()});

    if (packetFormat === 2018) {
      this.unpack2018Format();
    } else if (packetFormat === 2019) {
      this.unpack2019Format(buffer);
    }

    this.data = this.fromBuffer(buffer);
  }

  unpack2018Format = () => {
    this.string('m_eventStringCode', {length: 4});
  };

  unpack2019Format = (buffer: Buffer) => {
    const eventStringCode = this.getEventStringCode(buffer);

    this.string('m_eventStringCode', {length: 4});

    if (eventStringCode === EVENT_CODES.FastestLap) {
      this.uint8('vehicleIdx').float('lapTime');
    } else if (
        eventStringCode === EVENT_CODES.Retirement ||
        eventStringCode === EVENT_CODES.TeammateInPits ||
        eventStringCode === EVENT_CODES.RaceWinner) {
      this.uint8('vehicleIdx');
    }
  };

  getEventStringCode = (buffer: Buffer) => {
    const headerParser = new Parser()
                             .endianess('little')
                             .nest('m_header', {type: new PacketHeaderParser()})
                             .string('m_eventStringCode', {length: 4});
    const {m_eventStringCode} = headerParser.parse(buffer);
    return m_eventStringCode;
  };
}
