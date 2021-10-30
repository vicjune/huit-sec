import { useCallback } from 'react';
import { useSettings } from './useSettings';
import RnSound from 'react-native-sound';

RnSound.setCategory('Ambient');

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

const sounds: Record<Sound, RnSound> = {
  [Sound.CLICK]: new RnSound('click.mp3', RnSound.MAIN_BUNDLE),
  [Sound.TICK]: new RnSound('tick.mp3', RnSound.MAIN_BUNDLE),
  [Sound.BLIP]: new RnSound('blip.mp3', RnSound.MAIN_BUNDLE),
  [Sound.TIMEUP]: new RnSound('timesup_buzzer.wav', RnSound.MAIN_BUNDLE),
  [Sound.WRONG]: new RnSound('bad_buzzer.mp3', RnSound.MAIN_BUNDLE),
  [Sound.CORRECT]: new RnSound('correct.mp3', RnSound.MAIN_BUNDLE),
  [Sound.VICTORY]: new RnSound('kids_cheering.mp3', RnSound.MAIN_BUNDLE),
  [Sound.SURPRISE]: new RnSound('ooooh.mp3', RnSound.MAIN_BUNDLE),
};

export const useSound = () => {
  const { muted } = useSettings();

  const playSound = useCallback(
    (sound: Sound) => {
      if (!muted) {
        sounds[sound]?.play();
      }
    },
    [muted],
  );

  return { playSound };
};
