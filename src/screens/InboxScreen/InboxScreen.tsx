import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Tab, Tabs } from '../../components/Tabs';
import type { ReadUnReadTabTYpe } from '../CourierScreen/CourierScreen';
import type { MarkAllAsReadStatusType } from '../CourierScreen/CourierScreen.types';
import MessageList from './MessageList';

const styles = StyleSheet.create({
  overAll: {
    flexGrow: 1,
  },
  tabsContainer: {
    marginBottom: 4,
  },
  flatListContainerStyle: {
    flex: 1,
  },
});

type PropType = {
  activeTab: ReadUnReadTabTYpe;
  setUnreadActive: () => void;
  setAllNotificationsActive: () => void;
  setMessagesCount: React.Dispatch<React.SetStateAction<number>>;
  markAllAsReadStatus: MarkAllAsReadStatusType;
};
function InboxScreen({
  activeTab,
  setUnreadActive,
  setAllNotificationsActive,
  setMessagesCount,
  markAllAsReadStatus,
}: PropType) {
  return (
    <View style={styles.overAll}>
      <View style={styles.tabsContainer}>
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
  );
}

export default InboxScreen;
