export class FlowResponse<T> {
  holdingIdentityShortHash: string;
  clientRequestId: string;
  flowId: string;
  flowStatus: string;
  flowError: any;
  flowResult: T;
  timestamp: string;

  constructor(v: FlowResponse<T>) {
    this.holdingIdentityShortHash = v.holdingIdentityShortHash;
    this.clientRequestId = v.clientRequestId;
    this.flowId = v.flowId;
    this.flowStatus = v.flowStatus;
    this.flowError = v.flowError;
    this.flowResult = JSON.parse(v.flowResult as string);
    this.timestamp = v.timestamp;
  }
}
