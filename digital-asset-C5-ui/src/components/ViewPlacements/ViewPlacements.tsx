import Container from "@mui/material/Container";
import {CircularProgress} from "@mui/material";
import {
  ListArtAssetsQuery,
  ListCollectibleCardAssetsQuery,
  PlaceMutation,
  PlaceRequest,
  toPlacement
} from "./AssetsQuery.ts";
import PageHeader from "../shared/PageHeader/PageHeader.tsx";
import {PlacementsTable} from "../Placements/Placements.tsx";
import {useState} from "react";
import PlaceDialog from "./PlaceDialog.tsx";
import {ListArtTokensQuery, ListCollectibleCardTokensQuery} from "./TokensQuery.ts";
import {useQueryClient} from "@tanstack/react-query";
import {queryKeys} from "../shared/query/queryKeys.ts";

export default function ViewPlacements() {
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

  const [makePlacementDialogOpen, setMakePlacementDialogOpen] = useState('');

  const placeMutation = PlaceMutation(() => {
    //TODO invalidate only the query of approved/rejected asset type for better performance
    queryClient.refetchQueries({queryKey: [queryKeys.listArtTokens] }).then();
    queryClient.refetchQueries({queryKey: [queryKeys.listCollectibleCardTokens] }).then();
    closeMakePlacementDialog();
  });

  const handleWithdraw = (id: string) => {
    console.log(`Withdraw: ${id}`);
  }

  const handlePlace = (id: string) => {
    setMakePlacementDialogOpen(id);
  }

  const handleCallPlace = (request: PlaceRequest | null | undefined) => {
    if(request) {
      placeMutation.mutate(request);
    } else {
      closeMakePlacementDialog();
    }
  }

  const closeMakePlacementDialog = () => {
    setMakePlacementDialogOpen('');
  }

  return (
      <Container maxWidth="xl">
        <PageHeader
            title="Placements"
            subtitle="Your Placements"
        />
        {(artAssetsIsLoading || collectibleCardAssetsIsLoading || artTokensIsLoading || collectibleCardTokensIsLoading) &&
            <CircularProgress/>}

        {makePlacementDialogOpen && (
            <PlaceDialog dialogProps={{assetId: makePlacementDialogOpen }} onClose={handleCallPlace} />
        )}

        {
            artAssets && collectibleCardAssets && artTokens && collectibleCardTokens
            && !artAssetsIsLoading && !collectibleCardAssetsIsLoading && !artTokensIsLoading && !collectibleCardTokensIsLoading &&
            <PlacementsTable
                placements={[
                  ...toPlacement(artAssets!, artTokens!, 'art', 'Art'),
                  ...toPlacement(collectibleCardAssets!, collectibleCardTokens, 'collectibleCard', 'Collectible Card')
                ]!!}
                onWithdraw={handleWithdraw}
                onPlace={handlePlace}
            />
        }
      </Container>
  )
}
