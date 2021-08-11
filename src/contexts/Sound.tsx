import React, {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import RnSound from 'react-native-sound';
import { storage, STORAGE_MUTED } from '../utils/storage';

export enum Sound {
  CLICK,
  TICK,
  BLIP,
  TIMEUP,
  WRONG,
  CORRECT,
  VICTORY,
  SURPRISE,
}

interface SoundContext {
  playSound: (sound: Sound) => void;
  muted: boolean;
  setMuted: (muted: boolean) => void;
}

const soundContext = createContext<SoundContext>({
  playSound: () => {},
  muted: false,
  setMuted: () => {},
});

export const SoundProvider: FC = ({ children }) => {
  const [sounds, setSounds] = useState<Record<Sound, RnSound> | null>(null);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    RnSound.setCategory('Ambient');
    setSounds({
      [Sound.CLICK]: new RnSound('click.mp3', RnSound.MAIN_BUNDLE),
      [Sound.TICK]: new RnSound('tick.mp3', RnSound.MAIN_BUNDLE),
      [Sound.BLIP]: new RnSound('blip.mp3', RnSound.MAIN_BUNDLE),
      [Sound.TIMEUP]: new RnSound('timesup_buzzer.wav', RnSound.MAIN_BUNDLE),
      [Sound.WRONG]: new RnSound('bad_buzzer.mp3', RnSound.MAIN_BUNDLE),
      [Sound.CORRECT]: new RnSound('correct.mp3', RnSound.MAIN_BUNDLE),
      [Sound.VICTORY]: new RnSound('kids_cheering.mp3', RnSound.MAIN_BUNDLE),
      [Sound.SURPRISE]: new RnSound('ooooh.mp3', RnSound.MAIN_BUNDLE),
    });

    storage.get<boolean>(STORAGE_MUTED).then((storedMuted) => {
      storedMuted && setMuted(storedMuted);
    });
  }, []);

  const playSound = useCallback(
    (sound: Sound) => {
      if (!muted) {
        sounds?.[sound]?.play();
      }
    },
    [sounds, muted],
  );

  const setMutedCb = useCallback(
    (m: boolean) => {
      setMuted(m);
      storage.set(STORAGE_MUTED, m);
    },
    [setMuted],
  );

  return (
    <soundContext.Provider value={{ playSound, muted, setMuted: setMutedCb }}>
      {children}
    </soundContext.Provider>
  );
};

export const useSound = () => useContext(soundContext);
