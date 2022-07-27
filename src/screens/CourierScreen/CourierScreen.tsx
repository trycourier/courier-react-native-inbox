import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';

import { Events } from '@trycourier/client-graphql';
import { FullScreenIndicator, SvgDot } from '../../components';
import { BORDER_COLOR, GRAY, WHITE } from '../../constants/colors';
import {
  BOLD,
  FONT_EXTRA_LARGE,
  FONT_LARGE,
  SEMI_BOLD,
} from '../../constants/fontSize';
import { Tab, Tabs } from '../../components/Tabs';
import MessageList from './MessageList/MessageList';
import { Footer } from '../../components/Footer';
import {
  useBrand,
  useReactNativeCourier,
} from '../../context/CourierReactNativeProvider';
import type { MarkAllAsReadStatusType } from './CourierScreen.types';

const UNREAD_TAB_NAME = 'Unread';
const ALL_NOTIFICATIONS_TAB_NAME = 'All notifications';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
    flexGrow: 1,
  },
  headerContainer: {
    backgroundColor: WHITE,
    marginBottom: 4,
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
  flatListContainerStyle: {
    flex: 1,
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
  markAllAsReadTextStyle: {
    color: GRAY,
  },
});

function CourierScreen() {
  const { courierClient } = useReactNativeCourier();
  const { linearGradient } = useReactNativeCourier();
  const [messagesCount, setMessagesCount] = useState(0);
  const [markAllAsReadStatus, setMarkAllAsReadStatus] =
    useState<MarkAllAsReadStatusType>('Stale');

  const [activeTab, setActiveTab] = useState<
    typeof UNREAD_TAB_NAME | typeof ALL_NOTIFICATIONS_TAB_NAME
  >('Unread');

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
  const showMarkAllAsRead = () => activeTab === 'Unread' && messagesCount > 0;

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

  return (
    <LinearGradient colors={[topColor, bottomColor]} style={styles.container}>
      <View style={styles.overAll}>
        <View style={styles.messagesContainer}>
          <View style={headerContainerStyle}>
            <View style={styles.headerStyle}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.headerTextStyle}>Inbox</Text>
                <SvgDot color={primary} size={26} value={messagesCount} />
              </View>
              <View>
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
              </View>
            </View>
            <Tabs>
              <Tab
                title="Unread"
                isActive={activeTab === 'Unread'}
                onPress={setUnreadActive}
              />
              <Tab
                title="All notifications"
                isActive={activeTab === 'All notifications'}
                onPress={setAllNotificationsActive}
              />
            </Tabs>
          </View>
          <View style={styles.flatListContainerStyle}>
            {activeTab === 'All notifications' && (
              <MessageList isRead="all" setMessagesCount={setMessagesCount} />
            )}
            {activeTab === 'Unread' && (
              <MessageList
                isRead={false}
                setMessagesCount={setMessagesCount}
                markAllAsReadStatus={markAllAsReadStatus}
              />
            )}
          </View>
        </View>
        <Footer />
      </View>
    </LinearGradient>
  );
}

export default CourierScreen;
