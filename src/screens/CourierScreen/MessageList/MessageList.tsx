import React, { useState } from 'react';
import { StyleSheet, Text, View, TextStyle, FlatList } from 'react-native';
import { useMessage } from '../../../hooks/useMessage';
import type {
  isReadType,
  MessageType,
} from '../../../hooks/useMessage/MessagesStore/Messagestypes';
import { FullScreenIndicator, Message } from '../../../components';
import { BOLD } from '../../../constants/fontSize';
import { DIVIDER_COLOR, GRAY, LIGHT_GRAY } from '../../../constants/colors';
import {
  BottomModal,
  BottomModalOption,
} from '../../../components/BottomModal';
import { useBrand } from '../../../context/CourierProvider';

type PropType = {
  isRead: isReadType;
  setMessagesCount: React.Dispatch<React.SetStateAction<number>>;
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
    fontSize: 10,
  },
  bottomModalOptionContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

function MessageList({ isRead, setMessagesCount }: PropType) {
  const {
    renderMessages,
    isLoading,
    fetchMoreMessages,
    setSelectedMessage,
    selectedMessage,
    markAsReadEvent,
    markAsUnreadEvent,
    updateMessageRead,
  } = useMessage({
    isRead,
    setMessagesCount,
  });

  const {
    emptyState: { textColor, text: emptyText },
  } = useBrand();

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

  if (renderMessages.length === 0 && isLoading) return <FullScreenIndicator />;

  if (renderMessages.length === 0 && isLoading === false) {
    return (
      <View style={styles.emptyTextContainer}>
        <Text style={emptyTextStyle}>{emptyText}</Text>
      </View>
    );
  }

  return (
    <>
      <View style={styles.overAll}>
        {isLoading && (
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

export default MessageList;
