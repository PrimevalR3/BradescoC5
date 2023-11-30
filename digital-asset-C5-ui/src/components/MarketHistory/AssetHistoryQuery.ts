import {useQuery} from "@tanstack/react-query";
import {queryKeys} from "../shared/query/queryKeys.ts";

const assetHistory = async (assetId: string): Promise<AssetHistory> => {
  return new Promise((resolve) => resolve(
      {
        id: assetId,
        name: 'Sunflowers',
        description: 'Desc',
        valuation: 100,
        ownership: 0.5,
        prizeHistory: [
          {
            date: new Date(2022, 1, 28),
            prize: 30
          },
          {
            date: new Date(2023, 0, 15),
            prize: 20
          },
          {
            date: new Date(2023, 3, 25),
            prize: 120
          },
          {
            date: new Date(2023, 5, 2),
            prize: 50
          },
          {
            date: new Date(2023, 5, 2),
            prize: 150
          },
          {
            date: new Date(2023, 7, 7),
            prize: 150
          },
          {
            date: new Date(2023, 8, 1),
            prize: 500
          }
        ]
      }
  ));
}

export const AssetHistoryQuery = (assetId: string) =>
    useQuery({ queryKey: [queryKeys.assetHistory], queryFn: () => assetHistory(assetId) });

export interface AssetHistory {
  id: string,
  name: string,
  description: string,
  valuation: number,
  ownership: number,
  prizeHistory: PrizeHistoryMetric[],
}

export interface PrizeHistoryMetric {
  date: Date,
  prize: number
}
