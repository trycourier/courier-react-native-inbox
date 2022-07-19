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
  selected?: boolean;
};

function Preference({ title, subtitle, optionsTitle, selected }: Props) {
  return (
    <View style={styles.overAll}>
      <View style={styles.container}>
        <View>
          <Text style={styles.titleStyle}>{title}</Text>
          <Text style={styles.subTitleStyle}>{subtitle}</Text>
        </View>
        <Switch
          value={selected}
          trackColor={{
            true: PREFERENCE_SWITCH_ACTIVE_COLOR,
            false: PREFERENCE_SWITCH_INACTIVE_COLOR,
          }}
          thumbColor={selected ? PREFERENCE_PRIMARY_STYLE : WHITE}
        />
      </View>
      {selected && (
        <View style={styles.customizationOptionContainerStyles}>
          <CustomizeOptions title={optionsTitle} />
        </View>
      )}
    </View>
  );
}

Preference.defaultProps = {
  selected: false,
};

export default Preference;
