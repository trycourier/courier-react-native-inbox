export interface Colors {
  primary: string;
  secondary: string;
  tertiary: string;
  __typename: string;
}

export interface EmptyState {
  textColor: string;
  text: string;
  __typename: string;
}

export interface WidgetBackground {
  topColor: string;
  bottomColor: string;
  __typename: string;
}

export interface Inapp {
  borderRadius: string;
  disableMessageIcon: boolean;
  disableCourierFooter?: null | boolean;
  placement: string;
  emptyState: EmptyState;
  widgetBackground: WidgetBackground;
  colors?: null;
  icons?: null;
  toast?: null;
  __typename: string;
}

export interface BrandConfig {
  colors: Colors;
  inapp: Inapp;
  preferenceTemplates?: null[] | null;
}
