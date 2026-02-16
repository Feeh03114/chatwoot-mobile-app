import { PressableProps } from 'react-native';
import { SharedValue } from 'react-native-reanimated';

export type SendMessageButtonProps = PressableProps & {};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AddCommandButtonProps = PressableProps & {
  derivedAddMenuOptionStateValue: { readonly value: number };
};

export type PhotosCommandButtonProps = PressableProps & {};

export type VoiceRecordButtonProps = PressableProps & {};
