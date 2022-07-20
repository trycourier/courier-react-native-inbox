import { View, Text, StyleSheet, Switch } from 'react-native';
import React from 'react';
import {
  DIVIDER_COLOR,
  GRAY,
  PREFERENCE_SWITCH_ACTIVE_COLOR,
  PREFERENCE_SWITCH_INACTIVE_COLOR,
  PREFERENCE_PRIMARY_STYLE,
  WHITE,
} from '../../constants/colors';
import { SEMI_BOLD } from '../../constants/fontSize';
import CustomizeOptions from './CustomizeOptions';

const styles = StyleSheet.create({
  overAll: {
    borderColor: DIVIDER_COLOR,
    borderTopWidth: 1,
    paddingVertical: 26,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleStyle: {
    fontSize: 14,
    fontWeight: SEMI_BOLD,
  },
  subTitleStyle: {
    fontSize: 12,
    lineHeight: 16,
    maxWidth: 260,
    color: GRAY,
  },
  customizationOptionContainerStyles: {
    marginTop: 14,
  },
});

type Props = {
  title: string;
  subtitle: string;
  optionsTitle: string;
  isEnabled?: boolean;
};

function Preference({ title, subtitle, optionsTitle, isEnabled }: Props) {
  return (
    <View style={styles.overAll}>
      <View style={styles.container}>
        <View>
          <Text style={styles.titleStyle}>{title}</Text>
          <Text style={styles.subTitleStyle}>{subtitle}</Text>
        </View>
        <Switch
          value={isEnabled}
          trackColor={{
            true: PREFERENCE_SWITCH_ACTIVE_COLOR,
            false: PREFERENCE_SWITCH_INACTIVE_COLOR,
          }}
          thumbColor={isEnabled ? PREFERENCE_PRIMARY_STYLE : WHITE}
        />
      </View>
      {isEnabled && (
        <View style={styles.customizationOptionContainerStyles}>
          <CustomizeOptions
            title={optionsTitle}
            options={['Email', 'SMS', 'Push']}
          />
        </View>
      )}
    </View>
  );
}

Preference.defaultProps = {
  isEnabled: false,
};

export default Preference;
