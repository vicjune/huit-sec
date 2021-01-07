import { pickRandomItem } from './pickRandomItem';

export enum SpecialEventId {
  INNOCENT = 'INNOCENT',
  REDNECK = 'REDNECK',
  EVERYONE = 'EVERYONE',
  FLASHBACK = 'FLASHBACK',
  DUEL = 'DUEL',
}

export interface SpecialEvent {
  id: SpecialEventId;
  title: string;
  description: string;
  probability: number;
  minPlayers?: number;
}

const specialEvents: Record<SpecialEventId, SpecialEvent> = {
  [SpecialEventId.INNOCENT]: {
    id: SpecialEventId.INNOCENT,
    title: "L'innocent",
    description: 'Obligation de répondre à la question sans vulgarité',
    probability: 4,
  },
  [SpecialEventId.REDNECK]: {
    id: SpecialEventId.REDNECK,
    title: 'Le gros beauf',
    description: 'Obligation de répondre à la question par des trucs salaces',
    probability: 4,
  },
  [SpecialEventId.EVERYONE]: {
    id: SpecialEventId.EVERYONE,
    title: 'Bordel général',
    description:
      'Tout les autres répondent à la question en même temps, tu décides qui a le mieux répondu',
    probability: 2,
    minPlayers: 4,
  },
  [SpecialEventId.FLASHBACK]: {
    id: SpecialEventId.FLASHBACK,
    title: 'Flashback',
    description:
      'Il/Elle doit répondre à la question précédente sans que tu lui reposes',
    probability: 3,
  },
  [SpecialEventId.DUEL]: {
    id: SpecialEventId.DUEL,
    title: 'Duel',
    description:
      'Ces 2 joueurs répondent à la question en même temps, tu choisis le gagnant',
    probability: 4,
    minPlayers: 3,
  },
};

export const getRandomEvent = (playerNumber: number) => {
  const filteredSpecialEvents = Object.values(specialEvents).filter(
    ({ minPlayers }) => !minPlayers || playerNumber >= minPlayers,
  );

  const totalProbability = filteredSpecialEvents.reduce(
    (prev, { probability }) => prev + probability,
    0,
  );

  const eventsChances = filteredSpecialEvents.reduce(
    (prev, { id, probability }) => {
      return [...prev, ...Array(probability).fill(id)];
    },
    Array(100 - totalProbability).fill(null) as (SpecialEventId | null)[],
  );

  const pickedEvent = pickRandomItem(eventsChances);
  if (!pickedEvent) return undefined;
  return specialEvents[pickedEvent];
};
