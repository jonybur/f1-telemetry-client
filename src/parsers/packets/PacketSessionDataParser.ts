import {F1Parser} from '../F1Parser';

import {MarshalZoneParser} from './MarshalZoneParser';
import {PacketHeaderParser} from './PacketHeaderParser';
import {PacketSessionData} from './types';
import {WeatherForecastSampleParser} from './WeatherForecastSampleParser';

export class PacketSessionDataParser extends F1Parser {
  data: PacketSessionData;

  constructor(buffer: Buffer, packetFormat: number, bigintEnabled: boolean) {
    super();

    this.endianess('little')
        .nest('m_header', {
          type: new PacketHeaderParser(packetFormat, bigintEnabled),
        })
        .uint8('m_weather')
        .int8('m_trackTemperature')
        .int8('m_airTemperature')
        .uint8('m_totalLaps')
        .uint16le('m_trackLength')
        .uint8('m_sessionType')
        .int8('m_trackId');

    if (packetFormat === 2018) {
      this.uint8('m_era');
    }

    if (packetFormat === 2019 || packetFormat === 2020) {
      this.uint8('m_formula');
    }

    this.uint16le('m_sessionTimeLeft')
        .uint16le('m_sessionDuration')
        .uint8('m_pitSpeedLimit')
        .uint8('m_gamePaused')
        .uint8('m_isSpectating')
        .uint8('m_spectatorCarIndex')
        .uint8('m_sliProNativeSupport')
        .uint8('m_numMarshalZones')
        .array('m_marshalZones', {length: 21, type: new MarshalZoneParser()})
        .uint8('m_safetyCarStatus')
        .uint8('m_networkGame');

    if (packetFormat === 2020) {
      this.uint8('m_numWeatherForecastSamples')
          .array('m_weatherForecastSamples', {
            type: new WeatherForecastSampleParser(),
            length: 20,
          });
    }

    this.data = this.fromBuffer(buffer);
  }
}
