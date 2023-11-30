import {CreateArtAssetMutation} from "./CreateTokenQuery.ts";

export interface AssetType {
  key: string,
  label: string,
  message?: string,
}

export const assetTypes: AssetType[] = [
  {
    key: 'art',
    label: 'Art',
    message: 'Works of art require 2 pieces of information in order to submit, please make sure you have the documentation to hand.'
  },
  {
    key: 'collectibleCard',
    label: 'Collectible Card',
    message: 'A collectible card game (CCG), also called a trading card game (TCG) among other names, is a type of card game that mixes strategic deck building elements with features of trading cards, introduced with Magic: The Gathering in 1993.'
  }
]

export const assetTypeFromKey: (key: string) => AssetType =
    (key: string) => assetTypes.find((type) => type.key === key)!

export interface AssetTypeProps {
  mutation: (onSuccess: () => void) => any,
  formFields: FormField[]
}

export interface FormField {
  key: string,
  name: string,
  type: string,
  nameField?: boolean,
}

export const formFields: Map<string, AssetTypeProps> = new Map<string, AssetTypeProps>(Object.entries({
  art: {
    mutation: (onSuccess: () => void) => CreateArtAssetMutation(onSuccess),
    formFields: [
      {
        key: 'title',
        name: 'Title',
        type: 'string',
        nameField: true
      },
      {
        key: 'description',
        name: 'Description',
        type: 'string'
      },
      {
        key: 'artist',
        name: 'Artist',
        type: 'string'
      }
    ]
  },
  collectibleCard: {
    mutation: () => alert('It is just a mock'),
    formFields: [
      {
        key: 'cardName',
        name: 'Card Name',
        type: 'string',
        nameField: true
      },
      {
        key: 'condition',
        name: 'Condition',
        type: 'string'
      },
      {
        key: 'prize',
        name: 'Prize',
        type: 'number'
      },
      {
        key: 'rarity',
        name: 'Rarity',
        type: 'string'
      }
    ]
  }
}));
