import {F1Parser} from '../F1Parser';

export class PacketHeaderParser extends F1Parser {
  constructor(packetFormat: number, bigintEnabled: boolean) {
    super();

    this.endianess('little').uint16le('m_packetFormat');

    if (packetFormat === 2018) {
      this.uint8('m_packetVersion').uint8('m_packetId');
    }

    if (packetFormat === 2019 || packetFormat === 2020 || packetFormat === 2021) {
      this.uint8('m_gameMajorVersion')
          .uint8('m_gameMinorVersion')
          .uint8('m_packetVersion')
          .uint8('m_packetId');
    }

    if (bigintEnabled) {
      this.uint64('m_sessionUID');
    } else {
      this.skip(8);
    }

    this.floatle('m_sessionTime')
        .uint32('m_frameIdentifier')
        .uint8('m_playerCarIndex');

    if (packetFormat === 2020 || packetFormat === 2021) {
      this.uint8('m_secondaryPlayerCarIndex');
    }
  }
}
