import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Events } from '@trycourier/client-graphql';
import type { TextStyle } from 'react-native';
import { FullScreenIndicator, SvgDot } from '../../components';
import { Footer } from '../../components/Footer';
import { BORDER_COLOR, GRAY, WHITE } from '../../constants/colors';
import {
  BOLD,
  FONT_EXTRA_LARGE,
  FONT_LARGE,
  FONT_SMALL,
  SEMI_BOLD,
} from '../../constants/fontSize';
import {
  useBrand,
  useReactNativeCourier,
} from '../../context/CourierReactNativeProvider';
import InboxScreen from '../InboxScreen/InboxScreen';
import { PreferenceScreen } from '../PreferenceScreen';
import type { MarkAllAsReadStatusType } from './CourierScreen.types';

import prefLogo from '../../assets/preferences.png';

export type ReadUnReadTabTYpe = 'Unread' | 'All notifications';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
    flexGrow: 1,
  },
  headerContainer: {
    backgroundColor: WHITE,
  },
  headerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    marginLeft: 40,
    marginTop: 12,
    justifyContent: 'space-between',
    paddingRight: 16,
  },
  headerTextStyle: {
    fontSize: FONT_EXTRA_LARGE,
    fontWeight: SEMI_BOLD,
    marginRight: 8,
  },
  overAll: {
    justifyContent: 'space-between',
    flexGrow: 1,
  },
  messagesContainer: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 0,
  },

  brandLoadingFailedStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  brandLoadingFailTextStyle: {
    fontSize: FONT_LARGE,
    fontWeight: BOLD,
    textAlign: 'center',
  },
  markAllAsReadButtonStyle: {
    borderWidth: 1,
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 18,
    borderColor: BORDER_COLOR,
  },
  preferenceIconStyle: {
    height: 28,
    width: 28,
  },
  preferenceIconContainer: {
    marginLeft: 12,
  },
  markAllAsReadTextStyle: {
    color: GRAY,
  },

  preferencesAndMarkAllAsReadContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backToInboxStyle: {
    fontSize: FONT_SMALL,
  },
});

type ScreenType = 'Inbox' | 'Preferences';

function CourierScreen() {
  const { courierClient } = useReactNativeCourier();
  const { linearGradient } = useReactNativeCourier();
  const [messagesCount, setMessagesCount] = useState(0);
  const [markAllAsReadStatus, setMarkAllAsReadStatus] =
    useState<MarkAllAsReadStatusType>('Stale');
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('Inbox');
  const toggleCurrentScreen = () => {
    setMessagesCount(0);
    setCurrentScreen((prev) => (prev === 'Inbox' ? 'Preferences' : 'Inbox'));
  };

  const [activeTab, setActiveTab] = useState<ReadUnReadTabTYpe>('Unread');

  const { trackEventBatch } = Events({ client: courierClient });
  const markAllAsRead = () => {
    setMarkAllAsReadStatus('Initiated');
    trackEventBatch('read')
      .then(() => {
        setMarkAllAsReadStatus('Success');
      })
      .catch((err) => {
        setMarkAllAsReadStatus('Error');
        console.log('err', { err });
      })
      .finally(() => {
        setMarkAllAsReadStatus('Stale');
      });
  };

  const setUnreadActive = () => {
    setMessagesCount(0);
    setActiveTab('Unread');
  };
  const setAllNotificationsActive = () => {
    setMessagesCount(0);
    setActiveTab('All notifications');
  };
  const {
    isBrandLoading,
    borderRadius,
    colors: { primary },
    widgetBackground: { topColor, bottomColor },
    isBrandLoadingError,
  } = useBrand();
  const normalizedBorderRadius = Number(borderRadius.replace('px', ''));
  const showMarkAllAsRead = () =>
    activeTab === 'Unread' && messagesCount > 0 && currentScreen === 'Inbox';

  const headerContainerStyle = {
    ...styles.headerContainer,
    borderTopLeftRadius: normalizedBorderRadius,
    borderTopRightRadius: normalizedBorderRadius,
  };

  if (typeof linearGradient === 'undefined') return null;
  const LinearGradient = linearGradient as any;
  if (isBrandLoading) return <FullScreenIndicator />;
  if (isBrandLoadingError)
    return (
      <View style={styles.brandLoadingFailedStyle}>
        <Text style={styles.brandLoadingFailTextStyle}>
          An error has occurred. The inbox could not be loaded
        </Text>
      </View>
    );

  const backToInboxStyle: TextStyle[] = [
    styles.backToInboxStyle,
    { color: primary },
  ];

  return (
    <LinearGradient colors={[topColor, bottomColor]} style={styles.container}>
      <View style={styles.overAll}>
        <View style={styles.messagesContainer}>
          <View style={headerContainerStyle}>
            <View style={styles.headerStyle}>
              {currentScreen === 'Inbox' && (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.headerTextStyle}>Inbox</Text>
                  <SvgDot color={primary} size={26} value={messagesCount} />
                </View>
              )}

              {currentScreen === 'Preferences' && (
                <View>
                  <Text style={styles.headerTextStyle}>Preferences</Text>
                  <TouchableOpacity onPress={toggleCurrentScreen}>
                    <Text style={backToInboxStyle}>Back to Inbox</Text>
                  </TouchableOpacity>
                </View>
              )}

              <View style={styles.preferencesAndMarkAllAsReadContainer}>
                {showMarkAllAsRead() && (
                  <TouchableOpacity
                    onPress={markAllAsRead}
                    style={styles.markAllAsReadButtonStyle}
                  >
                    <Text style={styles.markAllAsReadTextStyle}>
                      Mark All as read
                    </Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={styles.preferenceIconContainer}
                  onPress={toggleCurrentScreen}
                >
                  <Image source={prefLogo} style={styles.preferenceIconStyle} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          {currentScreen === 'Inbox' && (
            <InboxScreen
              activeTab={activeTab}
              setUnreadActive={setUnreadActive}
              setAllNotificationsActive={setAllNotificationsActive}
              setMessagesCount={setMessagesCount}
              markAllAsReadStatus={markAllAsReadStatus}
            />
          )}
          {currentScreen === 'Preferences' && <PreferenceScreen />}
        </View>
        <Footer />
      </View>
    </LinearGradient>
  );
}

export default CourierScreen;
