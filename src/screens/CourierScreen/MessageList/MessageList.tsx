import React, { useEffect, useReducer, useState, useMemo } from 'react';
import { Events, Messages } from '@trycourier/client-graphql';
import { StyleSheet, Text, View, TextStyle, FlatList } from 'react-native';
import {
  messagesInitialState,
  messagesReducer,
} from '../MessagesStore/MessagesReducer';
import {
  getMessagesInitAction,
  getMessagesSuccessAction,
  messageStopLoadingAction,
  setMessagesAction,
} from '../MessagesStore/MessagesActions';
import type {
  GetMessagesSuccessPayloadType,
  MessageType,
} from '../MessagesStore/Messagestypes';
import { FullScreenIndicator, Message } from '../../../components';
import { BOLD } from '../../../constants/fontSize';
import { DIVIDER_COLOR, GRAY, LIGHT_GRAY } from '../../../constants/colors';
import {
  BottomModal,
  BottomModalOption,
} from '../../../components/BottomModal';
import { useBrand, useCourier } from '../../../context/CourierProvider';

type PropType = {
  isRead?: boolean;
  getAll?: boolean;
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
});

function MessageList({ isRead, getAll }: PropType) {
  const { courierClient } = useCourier();
  const { getMessages } = Messages({ client: courierClient });
  // todo: handle events
  // eslint-disable-next-line
  const { trackEvent } = Events({ client: courierClient });

  const [{ messages, isLoading, startCursor }, dispatch] = useReducer(
    messagesReducer,
    messagesInitialState
  );
  const {
    emptyState: { textColor, text: emptyText },
  } = useBrand();

  const [isBottomModalOpen, setIsBottomModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<
    MessageType | undefined
  >();
  const openBottomModal = () => setIsBottomModalOpen(true);
  const closeBottomModal = () => {
    setIsBottomModalOpen(false);
  };
  const handleMessageSelection = (message: MessageType) => {
    setSelectedMessage(message);
    openBottomModal();
  };

  const markAsReadEvent = async (currentMessage: MessageType) => {
    try {
      await trackEvent(currentMessage.content.trackingIds.readTrackingId);
      const updatedMessages = messages.map((message) => {
        if (message.id === currentMessage.id) return { ...message, read: true };
        return message;
      });
      closeBottomModal();
      dispatch(setMessagesAction({ payload: { messages: updatedMessages } }));
    } catch (e) {
      console.log({ e });
    }
  };

  const markAsUnreadEvent = async (currentMessage: MessageType) => {
    try {
      await trackEvent(currentMessage.content.trackingIds.unreadTrackingId);
      const updatedMessages = messages.map((message) => {
        if (message.id === currentMessage.id)
          return { ...message, read: false };
        return message;
      });
      closeBottomModal();
      dispatch(setMessagesAction({ payload: { messages: updatedMessages } }));
    } catch (e) {
      console.log({ e });
    }
  };

  const getMessagesInit = () => dispatch(getMessagesInitAction());
  const getMessageSuccess = ({
    payload,
  }: {
    payload: GetMessagesSuccessPayloadType;
  }) => dispatch(getMessagesSuccessAction({ payload }));
  const messagesStopLoading = () => dispatch(messageStopLoadingAction());

  const getQueryParams = () => {
    if (getAll) return undefined;
    return { isRead };
  };

  const renderMessages = useMemo(() => {
    if (getAll) {
      return messages;
    }
    if (isRead === false) {
      return messages.filter((message) => !message.read);
    }
  }, [JSON.stringify(messages)]);

  async function fetchData(fetchAfter?: string) {
    try {
      getMessagesInit();
      const messagesResp = await getMessages(getQueryParams(), fetchAfter);
      if (messagesResp) {
        const payload = {
          ...messagesResp,
          messages: [...messages, ...messagesResp.messages],
        };
        getMessageSuccess({ payload });
      }
    } catch (err) {
      messagesStopLoading();
    }
  }

  const resetMessages = () => {
    getMessageSuccess({
      payload: { appendMessages: false, messages: [], startCursor: null },
    });
  };

  useEffect(() => {
    resetMessages();
    fetchData();
    return resetMessages;
  }, []);

  const emptyTextStyle: TextStyle = {
    ...styles.textStyle,
    color: textColor,
  };

  if (messages.length === 0 && isLoading) return <FullScreenIndicator />;

  if (messages.length === 0 && isLoading === false) {
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
            <Message message={item} onPress={handleMessageSelection} />
          )}
          keyExtractor={({ id }) => id}
          onEndReached={() => {
            if (startCursor !== null) {
              fetchData(startCursor);
            }
          }}
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
                  Addional Message Actions
                </Text>
              </View>
              <View>
                {selectedMessage.read ? (
                  <BottomModalOption
                    onPress={() => {
                      markAsUnreadEvent(selectedMessage);
                    }}
                    option="Mark as Unread"
                  />
                ) : (
                  <BottomModalOption
                    onPress={() => {
                      markAsReadEvent(selectedMessage);
                    }}
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
  isRead: false,
  getAll: false,
};

export default MessageList;
