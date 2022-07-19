import { Text, Image, StyleSheet, ScrollView, View } from 'react-native';
import React from 'react';
import oyster from '../../assets/oyster.png';
import { BOLD, SEMI_BOLD } from '../../constants/fontSize';
import { GRAY, WHITE } from '../../constants/colors';
import Preference from '../../components/Preference/Preference';

const OYSTER_IMAGE_SIZE = 54;

const styles = StyleSheet.create({
  scrollViewStyle: {
    backgroundColor: WHITE,
  },
  overAll: {
    paddingTop: 40,
    paddingHorizontal: 20,
    backgroundColor: WHITE,
    paddingBottom: 37,
  },
  oysterImageSize: {
    height: OYSTER_IMAGE_SIZE,
    width: OYSTER_IMAGE_SIZE,
  },
  headerTextStyle: {
    marginVertical: 14,
    fontSize: 32,
    marginRight: 77,
    lineHeight: 44,
    fontWeight: BOLD,
  },
  subHeaderStyles: {
    marginRight: 77,
    lineHeight: 16,
    marginBottom: 14,
    color: GRAY,
    fontSize: 12,
  },
  preferenceSavedTimeStyle: {
    fontWeight: SEMI_BOLD,
    marginBottom: 23,
  },
});

function PreferenceScreen() {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={styles.scrollViewStyle}
    >
      <View style={styles.overAll}>
        <Image source={oyster} style={styles.oysterImageSize} />
        <Text style={styles.headerTextStyle}>Notification Preferences</Text>
        <Text style={styles.subHeaderStyles}>
          For the categories listed below, you can choose how you’d like Oyster
          to reach you.
        </Text>
        <Text style={[styles.subHeaderStyles, styles.preferenceSavedTimeStyle]}>
          Preferences last saved on Jun 15 at 3:45pm
        </Text>
        <Preference
          title="Invitations"
          subtitle="Be notified if you are invited to a group or event."
          optionsTitle="Customize Delivery Channels"
          selected
        />
        <Preference
          title="System Updates"
          subtitle="Be notified when system updates are made, keeping you up to speed"
          optionsTitle="Customize Delivery Channels"
        />
        <Preference
          title="Newsletter"
          subtitle="Be notified about the latest Treva news"
          optionsTitle="Customize Delivery Channels"
        />
      </View>
    </ScrollView>
  );
}

export default PreferenceScreen;
