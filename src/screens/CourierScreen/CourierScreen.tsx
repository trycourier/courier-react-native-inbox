import { View, Text, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import type { ViewStyle } from 'react-native';

import LinearGradientRn from 'react-native-linear-gradient';
import type { MessageType } from 'src/hooks/useMessage/MessagesStore/Messagestypes';
import { useUnreadNotifications } from '../../context/UnreadNotificationsContext';
import { useAllNotifications } from '../../context/AllNotificationsContext';
import { FullScreenIndicator, SvgDot } from '../../components';
import { WHITE } from '../../constants/colors';
import { BOLD, SEMI_BOLD } from '../../constants/fontSize';
import { Tab, Tabs } from '../../components/Tabs';
import { Footer } from '../../components/Footer';
import { useBrand } from '../../context/CourierReactNativeProvider';
import NotificationList from './NotificationList';

const UNREAD_TAB_NAME = 'Unread';
const ALL_NOTIFICATIONS_TAB_NAME = 'All notifications';

const LinearGradient = LinearGradientRn as unknown as (_props: {
  colors: string[];
  children: React.ReactElement;
  style: ViewStyle;
}) => JSX.Element;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: WHITE,
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
  },
  headerTextStyle: {
    fontSize: 24,
    fontWeight: SEMI_BOLD,
    marginRight: 8,
    color: 'black',
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
    fontSize: 16,
    fontWeight: BOLD,
    textAlign: 'center',
  },
});

type PropType = {
  onMessageClick?: (_m: MessageType) => void;
};

function CourierScreen({ onMessageClick }: PropType) {
  const {
    unreadNotificationsCount,
    unreadNotifications,
    fetchUnreadNotifications,
    fetchMoreUnreadNotifications,
    unreadNotificationsIsLoading,
  } = useUnreadNotifications();

  const {
    allNotificationsCount,
    allNotifications,
    fetchAllNotifications,
    fetchMoreAllCategoryNotifications,
    allNotificationsIsLoading,
  } = useAllNotifications();

  useEffect(() => {
    fetchUnreadNotifications({ prevMessages: [] });
    fetchAllNotifications({ prevMessages: [] });
  }, []);

  const [activeTab, setActiveTab] = useState<
    typeof UNREAD_TAB_NAME | typeof ALL_NOTIFICATIONS_TAB_NAME
  >('Unread');

  const setUnreadActive = () => {
    setActiveTab('Unread');
  };
  const setAllNotificationsActive = () => {
    setActiveTab('All notifications');
  };

  const {
    isBrandLoading,
    borderRadius,
    colors: { primary },
    widgetBackground,
    isBrandLoadingError,
  } = useBrand();

  let topColor = 'rgb(39,22,55)';
  let bottomColor = 'rgb(80,66,82)';
  const normalizedBorderRadius = Number(borderRadius.replace('px', ''));

  if (widgetBackground?.topColor) {
    topColor = widgetBackground.topColor;
  }

  if (widgetBackground?.bottomColor) {
    bottomColor = widgetBackground.bottomColor;
  }

  const headerContainerStyle = {
    ...styles.headerContainer,
    borderTopLeftRadius: normalizedBorderRadius,
    borderTopRightRadius: normalizedBorderRadius,
  };

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
              <Text style={styles.headerTextStyle}>Inbox</Text>
              <SvgDot
                color={primary}
                size={26}
                value={
                  activeTab === 'All notifications'
                    ? allNotificationsCount
                    : unreadNotificationsCount
                }
              />
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
              <NotificationList
                notifications={allNotifications}
                onMessageClick={onMessageClick}
                fetchMoreNotifications={fetchMoreAllCategoryNotifications}
                isLoading={allNotificationsIsLoading}
              />
            )}
            {activeTab === 'Unread' && (
              <NotificationList
                notifications={unreadNotifications}
                fetchMoreNotifications={fetchMoreUnreadNotifications}
                onMessageClick={onMessageClick}
                isLoading={unreadNotificationsIsLoading}
              />
            )}
          </View>
        </View>
        <Footer />
      </View>
    </LinearGradient>
  );
}

CourierScreen.defaultProps = {
  onMessageClick: undefined,
};

export default CourierScreen;
