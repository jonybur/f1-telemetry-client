import {Parser} from 'binary-parser';

import {F1Parser} from '../F1Parser';

import {CarMotionDataParser} from './CarMotionDataParser';
import {PacketHeaderParser} from './PacketHeaderParser';
import {PacketMotionData} from './types';

export class PacketMotionDataParser extends F1Parser {
  data: PacketMotionData;

  constructor(buffer: Buffer, packetFormat: number, bigintEnabled: boolean) {
    super();

    this.endianess('little')
        .nest('m_header', {
          type: new PacketHeaderParser(packetFormat, bigintEnabled),
        })
        .array('m_carMotionData', {
          length: packetFormat === 2020 || packetFormat === 2021 ? 22 : 20,
          type: new CarMotionDataParser(),
        })
        .array('m_suspensionPosition', {
          length: 4,
          type: new Parser().floatle(''),
        })
        .array('m_suspensionVelocity', {
          length: 4,
          type: new Parser().floatle(''),
        })
        .array('m_suspensionAcceleration', {
          length: 4,
          type: new Parser().floatle(''),
        })
        .array('m_wheelSpeed', {
          length: 4,
          type: new Parser().floatle(''),
        })
        .array('m_wheelSlip', {
          length: 4,
          type: new Parser().floatle(''),
        })
        .floatle('m_localVelocityX')
        .floatle('m_localVelocityY')
        .floatle('m_localVelocityZ')
        .floatle('m_angularVelocityX')
        .floatle('m_angularVelocityY')
        .floatle('m_angularVelocityZ')
        .floatle('m_angularAccelerationX')
        .floatle('m_angularAccelerationY')
        .floatle('m_angularAccelerationZ')
        .floatle('m_frontWheelsAngle');

    this.data = this.fromBuffer(buffer);
  }
}
