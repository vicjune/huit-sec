import { ElementType } from 'react';
import { default as EntIcon } from 'react-native-vector-icons/Entypo';

export enum BundleId {
  base = 'base',
  bundle_1 = 'bundle_1',
  bundle_2 = 'bundle_2',
  bundle_3 = 'bundle_3',
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
    id: BundleId.base,
    title: 'Questions de base',
    iconType: EntIcon,
    icon: 'box',
  },
  {
    id: BundleId.bundle_1,
    title: 'Encore plus tordues',
    iconType: EntIcon,
    icon: 'water',
    lockedByDefault: true,
  },
  {
    id: BundleId.bundle_2,
    title: "Pour mettre l'ambiance",
    iconType: EntIcon,
    icon: 'traffic-cone',
    lockedByDefault: true,
  },
  {
    id: BundleId.bundle_3,
    title: 'Si tu veux perdre des potes',
    iconType: EntIcon,
    icon: 'hand',
    lockedByDefault: true,
  },
];
