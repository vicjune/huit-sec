export enum BundleId {
  BASE = 'BASE',
  BUNDLE_1 = 'BUNDLE_1',
  BUNDLE_2 = 'BUNDLE_2',
  BUNDLE_3 = 'BUNDLE_3',
}

export interface Question {
  id: string;
  number: number;
  text: string;
  bundle: BundleId;
}
