import axios, {AxiosResponse} from "axios";
import {API_URL, queryKeys} from "../shared/query/queryKeys.ts";
import {useMutation} from "@tanstack/react-query";

const approvePlacement = async (request: ApprovalRequest) => {
  const response: AxiosResponse = await axios.post(`${API_URL}/approveNFTPlaceOrder`, request);
  return response.data;
}

export const ApprovePlacementMutation = (onSuccess: () => void) =>
    useMutation({mutationKey: [queryKeys.approvePlacement], mutationFn: approvePlacement, onSuccess });

const rejectPlacement = async (request: ApprovalRequest) => {
  const response: AxiosResponse = await axios.post(`${API_URL}/rejectNFTPlaceOrder`, request);
  return response.data;
}

export const RejectPlacementMutation = (onSuccess: () => void) =>
    useMutation({mutationKey: [queryKeys.rejectPlacement], mutationFn: rejectPlacement, onSuccess });

export interface ApprovalRequest {
  assetRef: string
}
