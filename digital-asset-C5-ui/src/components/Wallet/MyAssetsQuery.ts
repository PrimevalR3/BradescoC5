import {useMutation, useQuery} from "@tanstack/react-query";
import {queryKeys} from "../shared/query/queryKeys.ts";

const listMyAssets = async (): Promise<MyAsset[]> => {
  return new Promise((resolve) => resolve([
    {
      assetId: "476f5aa9-92d1-424c-8e7a-901ec89be6e7",
      name: 'Sunflowers',
      description: 'Desc',
      marketPrice: 80,
      purchasePrice: 100,
      amount: 20,
      ownership: 0.5,
      status: MyAssetStatus.PURCHASED
    },
    {
      assetId: "1df3c7bd-9fc8-47a5-b428-d55c4f997eac",
      name: 'Mona Lisa',
      description: 'Desc-2',
      marketPrice: 500,
      purchasePrice: 110,
      amount: 30,
      ownership: 0.1,
      status: MyAssetStatus.PURCHASED
    },
    {
      assetId: "b348aa23-69b3-4480-b8bc-42abc8890904",
      name: 'Mona Lisa',
      description: 'Desc-2',
      marketPrice: 500,
      purchasePrice: 130,
      amount: 40,
      ownership: 0.13,
      status: MyAssetStatus.ON_SELL
    },
    {
      assetId: "21e8a94b-2182-4f75-94e6-42b95688f3fa",
      name: 'Mona Lisa',
      description: 'Desc-2',
      marketPrice: 500,
      purchasePrice: 160,
      amount: 70,
      ownership: 0.13,
      status: MyAssetStatus.PURCHASED
    },
    {
      assetId: "93ba58ad-966a-4df2-a63c-e021a16ef206",
      name: 'Grunwald Battle',
      description: 'Desc-2',
      marketPrice: 700,
      purchasePrice: 650,
      amount: 80,
      status: MyAssetStatus.SOLD
    },
    {
      assetId: "dcffb7d3-00eb-44ca-84dc-8d3873c68456",
      name: 'Creation of Adam',
      description: 'Desc-2',
      marketPrice: 1100,
      purchasePrice: 950,
      amount: 10,
      ownership: 0.1,
      status: MyAssetStatus.PURCHASED
    },
  ]));
}

export const ListMyAssetsQuery = () =>
    useQuery({ queryKey: [queryKeys.listMyAssets], queryFn: listMyAssets });

const sellMyAsset = async (request: SellMyAssetRequest) => {
  console.log(`Sold: ${JSON.stringify(request)}`);
}

export const SellMyAssetMutation = (onSuccess?: () => void) =>
    useMutation({mutationKey: [queryKeys.sellMyAsset], mutationFn: sellMyAsset, onSuccess});

export interface MyAsset {
  assetId: string,
  name: string,
  description: string,
  marketPrice: number,
  purchasePrice: number,
  amount: number,
  ownership?: number,
  status: MyAssetStatus
}

export interface SellMyAssetRequest {
  assetId: string,
  price: number,
  amount: number,
}

export enum MyAssetStatus {
  ON_SELL = 'On Sell',
  SOLD = 'Sold',
  PURCHASED = 'Purchased'
}
