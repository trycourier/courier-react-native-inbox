import { View, Text, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';

import { Messages } from '@trycourier/client-graphql';
import { FullScreenIndicator, SvgDot } from '../../components';
import { WHITE } from '../../constants/colors';
import { SEMI_BOLD } from '../../constants/fontSize';
import { Tab, Tabs } from '../../components/Tabs';
import MessageList from './MessageList/MessageList';
import { Footer } from '../../components/Footer';
import { useBrand, useCourier } from '../../context/CourierProvider';

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
  },
  headerTextStyle: {
    fontSize: 24,
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
});

function CourierScreen() {
  const { courierClient, linearGradient } = useCourier();
  const { getMessageCount } = Messages({ client: courierClient });
  const [messagesCount, setMessagesCount] = useState(0);
  const [activeTab, setActiveTab] = useState<
    typeof UNREAD_TAB_NAME | typeof ALL_NOTIFICATIONS_TAB_NAME
  >('Unread');
  const setUnreadActive = () => setActiveTab('Unread');
  const setAllNotificationsActive = () => setActiveTab('All notifications');

  const {
    isBrandLoading,
    borderRadius,
    colors: { primary },
    widgetBackground: { topColor, bottomColor },
  } = useBrand();
  const normalizedBorderRadius = Number(borderRadius.replace('px', ''));

  useEffect(() => {
    async function fetchData() {
      try {
        const messageCount = await getMessageCount();
        setMessagesCount(messageCount);
      } catch (err) {
        console.log({ err });
      }
    }
    fetchData();
  }, []);

  const headerContainerStyle = {
    ...styles.headerContainer,
    borderTopLeftRadius: normalizedBorderRadius,
    borderTopRightRadius: normalizedBorderRadius,
  };

  if (typeof linearGradient === 'undefined') return null;
  const LinearGradient = linearGradient as any;
  if (isBrandLoading) return <FullScreenIndicator />;
  return (
    <LinearGradient colors={[topColor, bottomColor]} style={styles.container}>
      <View style={styles.overAll}>
        <View style={styles.messagesContainer}>
          <View style={headerContainerStyle}>
            <View style={styles.headerStyle}>
              <Text style={styles.headerTextStyle}>Inbox</Text>
              <SvgDot color={primary} size={26} value={messagesCount} />
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
            {activeTab === 'All notifications' && <MessageList isRead="all" />}
            {activeTab === 'Unread' && <MessageList isRead={false} />}
          </View>
        </View>
        <Footer />
      </View>
    </LinearGradient>
  );
}

export default CourierScreen;
