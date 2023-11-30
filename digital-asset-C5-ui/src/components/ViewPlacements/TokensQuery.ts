import {useQuery} from "@tanstack/react-query";
import {API_URL, queryKeys} from "../shared/query/queryKeys.ts";
import {sessionKeys} from "../../routes/storageKeys.ts";
import axios, {AxiosResponse} from "axios";
import {FlowResponse} from "../shared/Flow/FlowResponse.ts";

const listCollectibleCardTokens = async (): Promise<AssetToken[]> => {
  return new Promise((resolve) => resolve([
    {
      assetRef: "476f5aa9-92d1-424c-8e7a-901ec89be6e7",
      issuer: 'SHA-256:676C471BC8DC3D1324133CF087C20AA0137FC02348811E4162C79E560298FB1',
      owner: 'SHA-256:A034729933D1CBF407645E11D9C91D9AC1BFDDBEF23FD58CB36782E3F60AE659',
      symbol: 'CRD1',
      amount: 100,
      status: TokenStatus.APPROVED,
    },
    {
      assetRef: "1df3c7bd-9fc8-47a5-b428-d55c4f997eac",
      issuer: 'SHA-256:676C471BC8DC3D1324133CF087C20AA0137FC02348811E4162C79E560298FB1',
      owner: 'SHA-256:A034729933D1CBF407645E11D9C91D9AC1BFDDBEF23FD58CB36782E3F60AE659',
      symbol: 'CRD1',
      amount: 100,
      status: TokenStatus.APPROVED,
    },
  ]));
}

export const ListCollectibleCardTokensQuery = () =>
    useQuery({queryKey: [queryKeys.listCollectibleCardTokens], queryFn: listCollectibleCardTokens});

const listArtTokens = async (): Promise<AssetToken[]> => {
  const legalEntity = sessionStorage.getItem(sessionKeys.USER_LEGAL_ENTITY)!;
  const response: AxiosResponse<FlowResponse<AssetToken[]>> = await axios.get(`${API_URL}/listDigitalAssetLinkedTokens?legalEntity=${legalEntity}`);
  return new FlowResponse(response.data).flowResult;
}

export const ListArtTokensQuery = () =>
    useQuery({queryKey: [queryKeys.listArtTokens], queryFn: listArtTokens});

export interface AssetToken {
  assetRef: string,
  issuer: string,
  owner: string,
  symbol: string,
  amount: number,
  status: TokenStatus,
}

export enum TokenStatus {
  DRAFT = 'DRAFT',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  WITHDRAWN = 'WITHDRAWN',
  NOT_PLACED = 'NOT_PLACED'
}
