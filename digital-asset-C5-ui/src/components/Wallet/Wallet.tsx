import Container from "@mui/material/Container";
import {ListMyAssetsQuery, SellMyAssetMutation, SellMyAssetRequest} from "./MyAssetsQuery.ts";
import PageHeader from "../shared/PageHeader/PageHeader.tsx";
import {CircularProgress, Stack} from "@mui/material";
import {useState} from "react";
import SellDialog, {SellDialogProps} from "./SellDialog.tsx";
import {useQueryClient} from "@tanstack/react-query";
import {queryKeys} from "../shared/query/queryKeys.ts";
import WalletStatistics from "./Statistics/WalletStatistics.tsx";
import ListOfAssets from "./ListOfAssets/ListOfAssets.tsx";

export default function Wallet() {
  const {data: myAssets, isLoading: isMyAssetsLoading} = ListMyAssetsQuery();
  const [sellDialogOpen, setSellDialogOpen] = useState({});
  const sellMutation = SellMyAssetMutation(() => setSellDialogOpen({}));
  const queryClient = useQueryClient();

  const handleOpenSellDialog = (props: SellDialogProps) => {
    setSellDialogOpen(props);
  }

  const handleSell = (request: SellMyAssetRequest | null | undefined) => {
    if(request) {
      sellMutation.mutate(request);
      queryClient.invalidateQueries({queryKey: [queryKeys.listMyAssets]}).then();
    } else {
      setSellDialogOpen({});
    }
  }

  return (
      <Container maxWidth="xl">
        <PageHeader
            title="Wallet"
            subtitle="My Assets"
        />

        {isMyAssetsLoading && <CircularProgress/>}

        {!!Object.keys(sellDialogOpen).length &&
            <SellDialog dialogProps={sellDialogOpen} onClose={handleSell}/>}

        {!isMyAssetsLoading && myAssets &&
            <Stack>
              <WalletStatistics/>
              <ListOfAssets myAssets={myAssets} handleOpenSellDialog={handleOpenSellDialog}/>
            </Stack>
        }
      </Container>
  );
}

