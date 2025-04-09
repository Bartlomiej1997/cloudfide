import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('MarketDataController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/market-data/stats/BTCUSDT?from=2025-04-07T00:00:00.000Z&to=2025-04-09T00:00:00.000Z (GET)', () => {
    return request(app.getHttpServer())
      .get(
        '/market-data/stats/BTCUSDT?from=2025-04-07T00:00:00.000Z&to=2025-04-09T00:00:00.000Z',
      )
      .expect(200)
      .expect(
        '{"changeRateInPercent":-2.4326533214331163,"openPrice":"78430.00000000","highPrice":"81243.58000000","lowPrice":"74508.00000000","closePrice":"76522.07000000"}',
      );
  });
});
