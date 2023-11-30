import {useQuery} from "@tanstack/react-query";
import {queryKeys} from "../shared/query/queryKeys.ts";

const listAssets = async (): Promise<Asset[]> => {
  return new Promise((resolve) => resolve([
    {
      id: "476f5aa9-92d1-424c-8e7a-901ec89be6e7",
      name: 'Sunflowers',
      description: 'Desc',
      valuation: 100,
      ownership: 0.5
    },
    {
      id: "1df3c7bd-9fc8-47a5-b428-d55c4f997eac",
      name: 'Mona Lisa',
      description: 'Desc-2',
      valuation: 500,
      ownership: 1
    }
  ]));
}

export const ListAssetsQuery = () =>
    useQuery({ queryKey: [queryKeys.listMyAssets], queryFn: listAssets });

export interface Asset {
  id: string,
  name: string,
  description: string,
  valuation: number,
  ownership: number
}
