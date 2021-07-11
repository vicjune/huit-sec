import { ElementType } from 'react';
import { default as EntIcon } from 'react-native-vector-icons/Entypo';

export enum BundleId {
  BASE = 'BASE',
  BUNDLE_1 = 'BUNDLE_1',
  BUNDLE_2 = 'BUNDLE_2',
  BUNDLE_3 = 'BUNDLE_3',
}

interface Bundle {
  id: BundleId;
  title: string;
  lockedByDefault?: boolean;
  iconType: ElementType;
  icon: string;
}

export interface BundleWithInfos {
  id: BundleId;
  title: string;
  iconType: ElementType;
  icon: string;
  locked: boolean;
  questionsNbr: number;
  questionsNotSeenNbr: number;
  price?: string;
}

export const bundles: Bundle[] = [
  {
    id: BundleId.BASE,
    title: 'Questions de base',
    iconType: EntIcon,
    icon: 'box',
  },
  {
    id: BundleId.BUNDLE_1,
    title: 'Encore plus tordues',
    iconType: EntIcon,
    icon: 'water',
    lockedByDefault: true,
  },
  {
    id: BundleId.BUNDLE_2,
    title: "Pour mettre l'ambiance",
    iconType: EntIcon,
    icon: 'traffic-cone',
    lockedByDefault: true,
  },
  {
    id: BundleId.BUNDLE_3,
    title: 'Si tu veux perdre des potes',
    iconType: EntIcon,
    icon: 'hand',
    lockedByDefault: true,
  },
];
