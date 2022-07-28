import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TextStyle, View } from 'react-native';
import { FullScreenIndicator, Message } from '../../components';
import { BottomModal, BottomModalOption } from '../../components/BottomModal';
import { DIVIDER_COLOR, GRAY, LIGHT_GRAY } from '../../constants/colors';
import { BOLD, FONT_EXTRA_SMALL } from '../../constants/fontSize';
import { useBrand } from '../../context/CourierReactNativeProvider';
import { useMessage } from '../../hooks/useMessage';
import type {
  isReadType,
  MessageType,
} from '../../hooks/useMessage/MessagesStore/Messagestypes';
import type { MarkAllAsReadStatusType } from '../CourierScreen/CourierScreen.types';

type PropType = {
  isRead: isReadType;
  setMessagesCount: React.Dispatch<React.SetStateAction<number>>;
  markAllAsReadStatus?: MarkAllAsReadStatusType;
};

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
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: LIGHT_GRAY,
    zIndex: 2,
    opacity: 0.5,
  },
  overAll: {
    position: 'relative',
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
  additionalActionTextStyle: {
    color: GRAY,
    fontSize: FONT_EXTRA_SMALL,
  },
  bottomModalOptionContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

function MessageList({
  isRead,
  setMessagesCount,
  markAllAsReadStatus,
}: PropType) {
  const {
    renderMessages,
    isLoading,
    fetchMoreMessages,
    setSelectedMessage,
    selectedMessage,
    markAsReadEvent,
    markAsUnreadEvent,
    updateMessageRead,
    resetMessages,
    fetchData,
  } = useMessage({
    isRead,
    setMessagesCount,
  });

  const {
    emptyState: { textColor, text: emptyText },
  } = useBrand();

  useEffect(() => {
    resetMessages();
    fetchData();
    return resetMessages;
  }, []);

  useEffect(() => {
    if (markAllAsReadStatus === 'Success') {
      resetMessages();
    }
  }, [markAllAsReadStatus]);

  const [isBottomModalOpen, setIsBottomModalOpen] = useState(false);

  const openBottomModal = () => setIsBottomModalOpen(true);
  const closeBottomModal = () => {
    setIsBottomModalOpen(false);
  };
  const handleMessageSelection = (message: MessageType) => {
    setSelectedMessage(message);
    openBottomModal();
  };

  const handleMarkMessageRead = () => {
    markAsReadEvent().finally(() => {
      closeBottomModal();
    });
  };

  const handleMarkMessageUnread = () => {
    markAsUnreadEvent().finally(() => {
      closeBottomModal();
    });
  };

  const emptyTextStyle: TextStyle = {
    ...styles.textStyle,
    color: textColor,
  };

  useEffect(() => {}, [markAllAsReadStatus]);

  if (renderMessages.length === 0 && isLoading) return <FullScreenIndicator />;

  if (renderMessages.length === 0 && isLoading === false) {
    return (
      <View style={styles.emptyTextContainer}>
        <Text style={emptyTextStyle}>{emptyText}</Text>
      </View>
    );
  }

  const showMessageListLoading = () =>
    isLoading || markAllAsReadStatus === 'Initiated';

  return (
    <>
      <View style={styles.overAll}>
        {showMessageListLoading() && (
          <View style={styles.infiniteScrollLoaderContainer}>
            <FullScreenIndicator />
          </View>
        )}
        <FlatList
          data={renderMessages}
          renderItem={({ item }) => (
            <Message
              message={item}
              onPress={handleMessageSelection}
              onActionSuccess={() => {
                updateMessageRead({ read: true, selectedId: item.id });
              }}
            />
          )}
          keyExtractor={({ id }) => id}
          onEndReached={fetchMoreMessages}
          onEndReachedThreshold={0.01}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        />
      </View>
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
                    onPress={handleMarkMessageUnread}
                    option="Mark as Unread"
                  />
                ) : (
                  <BottomModalOption
                    onPress={handleMarkMessageRead}
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

MessageList.defaultProps = {
  markAllAsReadStatus: undefined,
};

export default MessageList;
