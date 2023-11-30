import {useMutation, useQuery} from "@tanstack/react-query";
import {API_URL, queryKeys} from "../shared/query/queryKeys.ts";
import {formFields} from "../Create/createDescriptor.ts";
import axios, {AxiosResponse} from "axios";
import {sessionKeys} from "../../routes/storageKeys.ts";
import {FlowResponse} from "../shared/Flow/FlowResponse.ts";
import {AssetToken, TokenStatus} from "./TokensQuery.ts";

const listArtAssets = async (): Promise<ArtAsset[]> => {
  const legalEntity = sessionStorage.getItem(sessionKeys.USER_LEGAL_ENTITY)!;
  const response: AxiosResponse<FlowResponse<ArtAsset[]>> = await axios.get(`${API_URL}/listDigitalAssets?legalEntity=${legalEntity}`);
  return new FlowResponse(response.data).flowResult;
};

export const ListArtAssetsQuery = () =>
    useQuery({ queryKey: [queryKeys.listArtAssets], queryFn: listArtAssets });

const listCollectibleCardAssets = async (): Promise<CollectibleCardAsset[]> => {
  return new Promise((resolve) => resolve([
    {
      assetId: "476f5aa9-92d1-424c-8e7a-901ec89be6e7",
      cardName: 'Black Lotus (MOCK)',
      condition: 'nmint',
      prize: 100,
      rarity: 'rare'
    },
    {
      assetId: "1df3c7bd-9fc8-47a5-b428-d55c4f997eac",
      cardName: 'Time Walk (MOCK)',
      condition: 'ex',
      prize: 50,
      rarity: 'rare'
    },
    {
      assetId: "7e083cae-cf0c-4ae4-bac9-758e9fc39d37",
      cardName: 'The One Ring (MOCK)',
      condition: 'nmint',
      prize: 100,
      rarity: 'rare'
    },
    {
      assetId: "f4e219f7-502d-4015-80b2-1d06b8e2d4b6",
      cardName: 'Mox (MOCK)',
      condition: 'ex',
      prize: 50,
      rarity: 'rare'
    },
  ]));
}

export const ListCollectibleCardAssetsQuery = () =>
    useQuery({ queryKey: [queryKeys.listCollectibleCardAssets], queryFn: listCollectibleCardAssets });

const place = async (request: PlaceRequest): Promise<void> => {
  await axios.post(`${API_URL}/placenftmarketplaceorder`, request);
}

export const PlaceMutation = (onSuccess: () => void) =>
    useMutation({ mutationKey: [queryKeys.place], mutationFn: place, onSuccess })

export interface ArtAsset {
  assetId: string,
  title: string,
  description: string,
  artist: string,
}

export interface CollectibleCardAsset {
  assetId: string,
  cardName: string,
  condition: string,
  prize: number,
  rarity: string,
}

export interface Placement {
  assetId: string;
  status: TokenStatus;
  name: string;
  type: string;
  amount?: number;
  props: any;
}

export interface PlaceRequest {
  amount: number;
  assetId: string;
  issuer: string;
  symbol: string;
}

export function toPlacement(listAssetResponse: any[], listTokenResponse: AssetToken[], key: string, type: string): Placement[] {
  const nameField = formFields.get(key)!.formFields.find(field => field.nameField)!.key;
  return listAssetResponse.map(item => {
    const token: AssetToken | undefined = listTokenResponse.find(token => token.assetRef === item.assetId);
    return {
      assetId: item.assetId,
      status: token ? token.status : TokenStatus.NOT_PLACED,
      name: item[nameField],
      type: type,
      amount: token?.amount,
      props: item
    }
  });
}

