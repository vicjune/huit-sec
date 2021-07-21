import { ElementType, useCallback } from 'react';
import { pickRandomItem } from './pickRandomItem';
import { default as FAIcon } from 'react-native-vector-icons/FontAwesome5';
import { default as EntIcon } from 'react-native-vector-icons/Entypo';
import { default as MIcon } from 'react-native-vector-icons/MaterialIcons';
import { default as MCIcon } from 'react-native-vector-icons/MaterialCommunityIcons';
import { useGlobalState } from '../contexts/GlobalState';
import { usePlayers } from './usePlayers';

export enum SpecialEventId {
  INNOCENT = 'INNOCENT',
  DIRTY = 'DIRTY',
  EVERYONE = 'EVERYONE',
  FLASHBACK = 'FLASHBACK',
  DUEL = 'DUEL',
}

export interface SpecialEvent {
  id: SpecialEventId;
  title: string;
  description: string;
  probability: number; // in %
  iconType: ElementType;
  icon: string;
  color: string;
  backgroundColors: string[];
  minPlayers?: number;
}

const specialEvents: Record<SpecialEventId, SpecialEvent> = {
  [SpecialEventId.INNOCENT]: {
    id: SpecialEventId.INNOCENT,
    title: 'Tellement innocent',
    description: 'Obligation de répondre à la question sans vulgarité',
    probability: 4,
    iconType: FAIcon,
    icon: 'baby-carriage',
    color: 'hsl(217, 100%, 78%)',
    backgroundColors: ['hsl(217, 100%, 65%)', 'hsl(217, 100%, 55%)'],
  },
  [SpecialEventId.DIRTY]: {
    id: SpecialEventId.DIRTY,
    title: 'Esprit mal tourné',
    description: 'Obligation de répondre à la question par des trucs salaces',
    probability: 4,
    iconType: EntIcon,
    icon: 'mask',
    color: 'hsl(292, 63%, 59%)',
    backgroundColors: ['hsl(292, 100%, 18%)', 'hsl(292, 100%, 8%)'],
  },
  [SpecialEventId.EVERYONE]: {
    id: SpecialEventId.EVERYONE,
    title: 'Bordel général',
    description:
      'Tout le monde répond à la question en même temps, tu décides du gagnant',
    probability: 2,
    iconType: MIcon,
    icon: 'local-fire-department',
    color: 'hsl(18, 100%, 61%)',
    backgroundColors: ['hsl(18, 100%, 50%)', 'hsl(18, 100%, 40%)'],
    minPlayers: 4,
  },
  [SpecialEventId.FLASHBACK]: {
    id: SpecialEventId.FLASHBACK,
    title: 'Flashback',
    description:
      'Il/Elle doit répondre à la question précédente sans que tu lui reposes',
    probability: 3,
    iconType: EntIcon,
    icon: 'back-in-time',
    color: 'hsl(53, 100%, 50%)',
    backgroundColors: ['hsl(53, 100%, 41%)', 'hsl(53, 100%, 31%)'],
  },
  [SpecialEventId.DUEL]: {
    id: SpecialEventId.DUEL,
    title: 'Duel',
    description:
      'Ces 2 joueurs répondent à la question en même temps, tu choisis le gagnant',
    probability: 4,
    iconType: MCIcon,
    icon: 'lightning-bolt',
    color: 'hsl(115, 47%, 51%)',
    backgroundColors: ['hsl(115, 71%, 22%)', 'hsl(115, 71%, 12%)'],
    minPlayers: 3,
  },
};

export const useSpecialEvent = () => {
  const { globalState, setGlobalState } = useGlobalState();
  const { currentEvent, turnsSinceLastEvent } = globalState;
  const { players } = usePlayers();

  const getRandomEvent = useCallback(() => {
    const filteredSpecialEvents = Object.values(specialEvents).filter(
      ({ minPlayers }) => !minPlayers || players.length >= minPlayers,
    );

    const totalProbability = filteredSpecialEvents.reduce(
      (prev, { probability }) => prev + probability,
      0,
    );

    const fillerNbr = 100 - turnsSinceLastEvent * 10 - totalProbability;
    const eventsChances = filteredSpecialEvents.reduce(
      (prev, { id, probability }) => {
        return [...prev, ...Array(probability).fill(id)];
      },
      Array(fillerNbr > 0 ? fillerNbr : 0).fill(
        null,
      ) as (SpecialEventId | null)[],
    );

    const pickedEvent = pickRandomItem(eventsChances);
    if (!pickedEvent) {
      setGlobalState((prev) => ({
        ...prev,
        turnsSinceLastEvent: prev.turnsSinceLastEvent + 1,
      }));
      return undefined;
    }
    setGlobalState((prev) => ({
      ...prev,
      turnsSinceLastEvent: 0,
    }));
    return specialEvents[pickedEvent];
  }, [players.length, setGlobalState, turnsSinceLastEvent]);

  return { currentEvent, getRandomEvent };
};
