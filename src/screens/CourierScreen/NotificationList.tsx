import {
  FlatList,
  TouchableOpacity,
  View,
  Text,
  TextStyle,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import React, { useState } from 'react';
import { Events } from '@trycourier/client-graphql';
import { useUnreadNotifications } from '../../context/UnreadNotificationsContext';
import { useAllNotifications } from '../../context/AllNotificationsContext';
import type {
  MessageType,
  TrackingIds,
} from '../../hooks/useMessage/MessagesStore/Messagestypes';
import { DIVIDER_COLOR, GRAY, LIGHT_GRAY } from '../../constants/colors';
import {
  useBrand,
  useReactNativeCourier,
} from '../../context/CourierReactNativeProvider';
import {
  Message,
  FullScreenIndicator,
  BottomModal,
  BottomModalOption,
} from '../../components';
import { BOLD } from '../../constants/fontSize';

const styles = StyleSheet.create({
  emptyTextContainer: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textStyle: {
    fontWeight: BOLD,
  },
  infiniteScrollLoaderContainer: {
    marginBottom: 6,
  },
  bottomMenuContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: LIGHT_GRAY,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: 'hidden',
  },
  additionalMessageActionContainer: {
    paddingTop: 20,
    paddingBottom: 10,
    borderBottomColor: DIVIDER_COLOR,
    borderBottomWidth: 1,
    flexGrow: 1,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomModalOptionContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  additionalActionTextStyle: {
    color: GRAY,
    fontSize: 10,
  },
});

type PropType = {
  notifications: MessageType[];
  onMessageClick?: (_m: MessageType) => void;
  fetchMoreNotifications: () => void;
  isLoading: boolean;
};

function NotificationList({
  notifications,
  onMessageClick,
  fetchMoreNotifications,
  isLoading,
}: PropType) {
  const [selectedMessage, setSelectedMessage] = useState<
    MessageType | undefined
  >();
  const [isBottomModalOpen, setIsBottomModalOpen] = useState(false);
  const openBottomModal = () => setIsBottomModalOpen(true);
  const hideBottomModal = () => setIsBottomModalOpen(false);
  const { courierClient } = useReactNativeCourier();
  const { trackEvent } = Events({ client: courierClient });
  const {
    unreadNotifications,
    setUnreadNotifications,
    setUnreadNotificationsCount,
  } = useUnreadNotifications();
  const { allNotifications, setAllNotifications } = useAllNotifications();

  const closeBottomModal = () => {
    setIsBottomModalOpen(false);
  };
  const handleMessageSelection = (message: MessageType) => {
    setSelectedMessage(message);
    openBottomModal();
  };

  let textColor = '#fff';
  let emptyText = 'No Message Found';

  const { emptyState } = useBrand();

  if (emptyState?.textColor) {
    textColor = emptyState.textColor;
  }
  if (emptyState?.text) {
    emptyText = emptyState.text;
  }

  const emptyTextStyle: TextStyle = {
    ...styles.textStyle,
    color: textColor,
  };

  const handleUnreadMessageUpdate = ({
    selectedMessage: currentSelectedMessage,
    isMarkingRead,
  }: {
    selectedMessage: MessageType;
    isMarkingRead: boolean;
  }) => {
    let updatedUnreadNotifications: MessageType[] = [...unreadNotifications];
    if (isMarkingRead) {
      updatedUnreadNotifications = unreadNotifications.filter(
        (notification) => notification.id !== currentSelectedMessage.id
      );
      setUnreadNotificationsCount((prev) => prev - 1);
    } else {
      updatedUnreadNotifications = [
        { ...currentSelectedMessage, read: false },
        ...unreadNotifications,
      ];
      setUnreadNotificationsCount((prev) => prev + 1);
    }
    setUnreadNotifications(updatedUnreadNotifications);
  };

  const toggleAllMessageCategoryStatus = ({
    selectedMessage: currentSelectedMessage,
  }: {
    selectedMessage: MessageType;
  }) => {
    const updatedAllNotifications = allNotifications.map((notification) => {
      if (notification.id === currentSelectedMessage.id) {
        return { ...notification, read: !notification.read };
      }
      return notification;
    });
    setAllNotifications(updatedAllNotifications);
  };

  const genericReadUnreadEvent =
    ({ key }: { key: keyof TrackingIds }) =>
    async () => {
      if (typeof selectedMessage === 'undefined') {
        return Promise.reject();
      }
      const selectedTrackingId = selectedMessage.content.trackingIds[key];
      if (typeof selectedTrackingId === 'undefined') return Promise.reject();
      try {
        await trackEvent(selectedTrackingId);

        if (key === 'readTrackingId') {
          //*  handle read event
          handleUnreadMessageUpdate({ selectedMessage, isMarkingRead: true });
        } else if (key === 'unreadTrackingId') {
          //*  handle unread event
          handleUnreadMessageUpdate({ selectedMessage, isMarkingRead: false });
        }

        //* handle all message status
        toggleAllMessageCategoryStatus({ selectedMessage });

        return Promise.resolve({ success: true });
      } catch (e) {
        console.error({ e });
        return Promise.reject();
      } finally {
        hideBottomModal();
      }
    };

  const markAsReadEvent = genericReadUnreadEvent({
    key: 'readTrackingId',
  });
  const markAsUnreadEvent = genericReadUnreadEvent({
    key: 'unreadTrackingId',
  });

  if (notifications.length === 0 && isLoading) return <FullScreenIndicator />;

  if (notifications.length === 0 && isLoading === false) {
    return (
      <View style={styles.emptyTextContainer}>
        <Text style={emptyTextStyle}>{emptyText}</Text>
      </View>
    );
  }
  return (
    <>
      <FlatList
        data={notifications}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={
              typeof onMessageClick === 'function'
                ? () => onMessageClick(item)
                : () => {}
            }
          >
            <Message
              message={item}
              onPress={handleMessageSelection}
              onActionSuccess={() => {
                if (item.read) return;
                handleUnreadMessageUpdate({
                  selectedMessage: item,
                  isMarkingRead: true,
                });
                toggleAllMessageCategoryStatus({ selectedMessage: item });
              }}
              isFirst={index === 0}
            />
          </TouchableOpacity>
        )}
        keyExtractor={({ id }) => id}
        onEndReached={fetchMoreNotifications}
        onEndReachedThreshold={0.01}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      />
      {isLoading && (
        <View style={styles.infiniteScrollLoaderContainer}>
          <ActivityIndicator />
        </View>
      )}
      <BottomModal open={isBottomModalOpen} onClose={closeBottomModal}>
        <View style={styles.bottomMenuContainer}>
          {typeof selectedMessage !== 'undefined' && (
            <>
              <View style={styles.additionalMessageActionContainer}>
                <Text style={styles.additionalActionTextStyle}>
                  Additional Message Actions
                </Text>
              </View>
              <View style={styles.bottomModalOptionContainer}>
                {selectedMessage.read ? (
                  <BottomModalOption
                    onPress={markAsUnreadEvent}
                    option="Mark as Unread"
                  />
                ) : (
                  <BottomModalOption
                    onPress={markAsReadEvent}
                    option="Mark as read"
                  />
                )}
              </View>
            </>
          )}
        </View>
      </BottomModal>
    </>
  );
}

export default NotificationList;

NotificationList.defaultProps = {
  onMessageClick: undefined,
};
