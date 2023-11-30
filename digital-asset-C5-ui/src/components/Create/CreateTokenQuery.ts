import axios, {AxiosResponse} from "axios";
import {API_URL, queryKeys} from "../shared/query/queryKeys.ts";
import {useMutation} from "@tanstack/react-query";

const createArtAsset = async (request: CreateArtAssetRequest) => {
  const response: AxiosResponse = await axios.post(`${API_URL}/issuedigitalassettoken`, request);
  return response.data;
}

export const CreateArtAssetMutation = (onSuccess: () => void) =>
    useMutation({mutationKey: [queryKeys.createArtAsset], mutationFn: createArtAsset, onSuccess });

export interface CreateArtAssetRequest {
  artist: string,
  description: string,
  title: string,
}
