import {useQuery} from "@tanstack/react-query";
import {queryKeys} from "../shared/query/queryKeys.ts";

const assetDetails = async (assetId: string): Promise<AssetDetails> => {
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
        ],
        ownershipHistory: [
          {
            seller: 'CN=Bank, OU=Test Dept, O=R3, L=London, C=GB',
            buyer: 'CN=Alice, OU=Test Dept, O=R3, L=London, C=GB',
            prize: 30,
            amount: 20,
            date: new Date(2022, 1, 28)
          },
          {
            seller: 'CN=Alice, OU=Test Dept, O=R3, L=London, C=GB',
            buyer: 'CN=Bob, OU=Test Dept, O=R3, L=London, C=GB',
            prize: 30,
            amount: 10,
            date: new Date(2022, 1, 28)
          },
          {
            seller: 'CN=Alice, OU=Test Dept, O=R3, L=London, C=GB',
            buyer: 'CN=Charlie, OU=Test Dept, O=R3, L=London, C=GB',
            prize: 20,
            amount: 10,
            date: new Date(2023, 0, 15)
          },
          {
            seller: 'CN=Charlie, OU=Test Dept, O=R3, L=London, C=GB',
            buyer: 'CN=Alice, OU=Test Dept, O=R3, L=London, C=GB',
            prize: 120,
            amount: 10,
            date: new Date(2023, 3, 25),
          }
        ],
        offers: [
          {
            offerId: '32d49c75-de1c-45ac-90b2-c339b25c0c84',
            seller: 'CN=Bob, OU=Test Dept, O=R3, L=London, C=GB',
            prize: 530,
            amount: 10,
            date: new Date(2023, 7, 28)
          },
          {
            offerId: '1046568f-05ce-4717-83db-d8b56fbc639f',
            seller: 'CN=Bank, OU=Test Dept, O=R3, L=London, C=GB',
            prize: 500,
            amount: 70,
            date: new Date(2022, 1, 28)
          },
        ]
      }
  ));
}

export const AssetDetailsQuery = (assetId: string) =>
    useQuery({queryKey: [queryKeys.assetHistory], queryFn: () => assetDetails(assetId)});

export interface AssetDetails {
  id: string,
  name: string,
  description: string,
  valuation: number,
  ownership: number,
  prizeHistory: PrizeHistoryMetric[],
  ownershipHistory: OwnershipHistoryEntry[],
  offers: Offer[]
}

export interface PrizeHistoryMetric {
  date: Date,
  prize: number
}

export interface OwnershipHistoryEntry {
  seller: string,
  buyer: string,
  prize: number,
  amount: number,
  date: Date
}

export interface Offer {
  offerId: string,
  seller: string,
  date: Date,
  amount: number,
  prize: number
}
