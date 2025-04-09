import { HttpService } from '@nestjs/axios';
import { BinanceService } from './binance.service';
import { Observable, of } from 'rxjs';
import { AxiosResponse } from 'axios';
import { MarketSymbol } from './model/market-symbol';

const klinesDataMock = [
  [
    1743984000000,
    '78430.00000000',
    '78520.00000000',
    '77419.90000000',
    '78327.87000000',
    '2646.04264000',
    1743987599999,
    '206354885.67319210',
    370277,
    '1373.18450000',
    '107113232.51086720',
    '0',
  ],
  [
    1743987600000,
    '78327.86000000',
    '79347.46000000',
    '78318.00000000',
    '79142.01000000',
    '2024.95477000',
    1743991199999,
    '159790839.72130870',
    376366,
    '1048.83893000',
    '82758594.49895340',
    '0',
  ],
];

const expectedData = [
  {
    openTime: 1743984000000,
    openPrice: '78430.00000000',
    highPrice: '78520.00000000',
    lowPrice: '77419.90000000',
    closePrice: '78327.87000000',
  },
  {
    openTime: 1743987600000,
    openPrice: '78327.86000000',
    highPrice: '79347.46000000',
    lowPrice: '78318.00000000',
    closePrice: '79142.01000000',
  },
];

describe('BinanceController', () => {
  let httpService: HttpService;
  let binanceService: BinanceService;

  beforeEach(() => {
    httpService = new HttpService();
    binanceService = new BinanceService(httpService);
  });

  describe('fetchHistoricalMarketData', () => {
    it('should fetch candlesticks from binance', async () => {
      jest.spyOn(httpService, 'get').mockImplementation(() => {
        return of({ data: klinesDataMock }) as Observable<
          AxiosResponse<unknown, unknown>
        >;
      });

      expect(
        await binanceService.fetchHistoricalMarketData(
          MarketSymbol.BTCUSDT,
          new Date(),
          new Date(),
        ),
      ).toStrictEqual(expectedData);
    });
  });
});
