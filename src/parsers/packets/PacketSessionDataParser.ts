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

    if (packetFormat === 2019 || packetFormat === 2020 || packetFormat === 2021) {
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

    if (packetFormat === 2020 || packetFormat === 2021) {
      this.uint8('m_numWeatherForecastSamples');
    };

    if (packetFormat === 2020) {
      this.array('m_weatherForecastSamples', {
        type: new WeatherForecastSampleParser(packetFormat),
        length: 20,
      });
    };

    if (packetFormat === 2021) {
      this.array('m_weatherForecastSamples', {
        type: new WeatherForecastSampleParser(packetFormat),
        length: 56,
      })
      .uint8('m_forecastAccuracy')
      .uint8('m_aiDifficulty')
      .uint32le('m_seasonLinkIdentifier')
      .uint32le('m_weekendLinkIdentifier')
      .unit32le('m_sessionLinkIdentifier')
      .unit8('m_pitStopWindowIdealLap')
      .unit8('m_pitStopWindowLatestLap')
      .uint8('m_pitStopRejoinPosition')
      .uint8('m_steeringAssist')
      .uint8('m_brakingAssist')
      .uint8('m_gearboxAssist')
      .unit8('m_pitAssist')
      .uint8('m_pitReleaseAssist')
      .uint8('m_ERSAssist')
      .uint8('m_DRSAssist')
    }

    this.data = this.fromBuffer(buffer);
  }
}
