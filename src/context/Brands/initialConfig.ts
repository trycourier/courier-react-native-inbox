import type { BrandConfig } from './brands.types';

export const brandInitialConfig: BrandConfig = {
  colors: {
    primary: '#9122C2',
    secondary: '#C1B6DD',
    tertiary: '#E85178',
    __typename: 'BrandColors',
  },
  inapp: {
    borderRadius: '24px',
    disableMessageIcon: true,
    disableCourierFooter: null,
    placement: 'bottom',
    emptyState: {
      textColor: '#ffffff',
      text: 'You have no notifications at this time',
      __typename: 'InAppEmptyState',
    },
    widgetBackground: {
      topColor: '#9122C2',
      bottomColor: '#E85178',
      __typename: 'InAppWidgetBackground',
    },
    colors: null,
    icons: null,
    toast: null,
    __typename: 'BrandInApp',
  },
  preferenceTemplates: [],
};
