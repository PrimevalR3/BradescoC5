import Container from "@mui/material/Container";
import {
  ListArtAssetsQuery,
  ListCollectibleCardAssetsQuery,
  toPlacement
} from "../ViewPlacements/AssetsQuery.ts";
import PageHeader from "../shared/PageHeader/PageHeader.tsx";
import {CircularProgress} from "@mui/material";
import {PlacementsTable} from "../Placements/Placements.tsx";
import {ApprovePlacementMutation, RejectPlacementMutation} from "../Approval/ApprovalQuery.ts";
import {useQueryClient} from "@tanstack/react-query";
import {queryKeys} from "../shared/query/queryKeys.ts";
import {ListArtTokensQuery, ListCollectibleCardTokensQuery} from "../ViewPlacements/TokensQuery.ts";

export default function BankDashboard() {
  const queryClient = useQueryClient();
  const {data: artAssets, isLoading: artAssetsIsLoading} = ListArtAssetsQuery();
  const {data: artTokens, isLoading: artTokensIsLoading} = ListArtTokensQuery();
  const {
    data: collectibleCardAssets,
    isLoading: collectibleCardAssetsIsLoading
  } = ListCollectibleCardAssetsQuery();
  const {
    data: collectibleCardTokens,
    isLoading: collectibleCardTokensIsLoading
  } = ListCollectibleCardTokensQuery();

  //TODO invalidate only the query of approved/rejected asset type for better performance
  const handleApprovalSuccess = () => {
    queryClient.invalidateQueries({queryKey: [queryKeys.listArtTokens] }).then();
    queryClient.invalidateQueries({queryKey: [queryKeys.listCollectibleCardTokens] }).then();
  }

  const approveMutation = ApprovePlacementMutation(handleApprovalSuccess);
  const rejectMutation = RejectPlacementMutation(handleApprovalSuccess);

  const handleApprove = (id: string) => {
    approveMutation.mutate({assetRef: id});
  }

  const handleReject = (id: string) => {
    rejectMutation.mutate({assetRef: id});
  }

  return (
      <Container maxWidth="xl">
        <PageHeader
            title="Placements"
            subtitle="Your Placements"
        />
        {(artAssetsIsLoading || collectibleCardAssetsIsLoading || artTokensIsLoading || collectibleCardTokensIsLoading) &&
            <CircularProgress/>}

        {
            artAssets && collectibleCardAssets && artTokens && collectibleCardTokens
            && !artAssetsIsLoading && !collectibleCardAssetsIsLoading && !artTokensIsLoading && !collectibleCardTokensIsLoading &&
            <PlacementsTable
                placements={[
                  ...toPlacement(artAssets!, artTokens, 'art', 'Art'),
                  ...toPlacement(collectibleCardAssets!, collectibleCardTokens, 'collectibleCard', 'Collectible Card')
                ]!!}
                onApprove={handleApprove}
                onReject={handleReject}
            />
        }
      </Container>
  )
}
