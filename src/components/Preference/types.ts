import type { PreferencesStatusType } from '../../context/Brands/brands.types';

export type SelectedOptionType = 'email' | 'push';
export type UpdateSelectedOptionsType = (_option: SelectedOptionType) => void;

export interface RecipientPreferenceType {
  hasCustomRouting?: boolean;
  routingPreferences: SelectedOptionType[];
  status: PreferencesStatusType;
  templateId: String;
  __typename: String;
}
