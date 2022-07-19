import type { StackNavigationProp } from '@react-navigation/stack';

export type RootStackParamList = {
  Home: undefined;
  Courier: undefined;
  Preference: undefined;
};

export type CourierScreenNavigationProp =
  StackNavigationProp<RootStackParamList>;
