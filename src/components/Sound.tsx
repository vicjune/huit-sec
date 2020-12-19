import React, {
  createContext,
  FC,
  useContext,
  useEffect,
  useState,
} from 'react';
import RnSound from 'react-native-sound';

export enum Sound {
  CLICK,
  TICK,
  BLIP,
  TIMEUP,
  WRONG,
  CORRECT,
}

interface SoundContext {
  playSound: (sound: Sound) => void;
}

const soundContext = createContext<SoundContext>({
  playSound: () => {},
});

export const SoundProvider: FC = ({ children }) => {
  const [sounds, setSounds] = useState<Record<Sound, RnSound> | null>(null);

  useEffect(() => {
    RnSound.setCategory('Ambient');

    setSounds({
      [Sound.CLICK]: new RnSound('click.mp3', RnSound.MAIN_BUNDLE),
      [Sound.TICK]: new RnSound('tick.mp3', RnSound.MAIN_BUNDLE),
      [Sound.BLIP]: new RnSound('blip.mp3', RnSound.MAIN_BUNDLE),
      [Sound.TIMEUP]: new RnSound('timesup_buzzer.wav', RnSound.MAIN_BUNDLE),
      [Sound.WRONG]: new RnSound('bad_buzzer.mp3', RnSound.MAIN_BUNDLE),
      [Sound.CORRECT]: new RnSound('correct.mp3', RnSound.MAIN_BUNDLE),
    });
  }, []);

  const playSound = (sound: Sound) => {
    sounds?.[sound]?.play();
  };

  return (
    <soundContext.Provider value={{ playSound }}>
      {children}
    </soundContext.Provider>
  );
};

export const useSound = () => {
  const { playSound } = useContext(soundContext);
  return { playSound };
};
