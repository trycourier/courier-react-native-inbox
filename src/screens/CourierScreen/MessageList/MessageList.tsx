import React, { useEffect, useReducer, useState } from 'react';
import { Messages } from '@trycourier/client-graphql';
import {
  StyleSheet,
  Text,
  View,
  TextStyle,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {
  messagesInitialState,
  messagesReducer,
} from '../MessagesStore/MessagesReducer';
import {
  getMessagesInitAction,
  getMessagesSuccessAction,
  messageStopLoadingAction,
} from '../MessagesStore/MessagesActions';
import type {
  GetMessagesSuccessPayloadType,
  MessageType,
} from '../MessagesStore/Messagestypes';
import { FullScreenIndicator, Message } from '../../../components';
import { BOLD } from '../../../constants/fontSize';
import {
  DIVIDER_COLOR,
  GRAY,
  LIGHT_GRAY,
  STORM_BLUE,
} from '../../../constants/colors';
import { BottomModal } from '../../../components/BottomModal';
import { useBrand, useCourier } from '../../../context/CourierProvider';

type PropType = {
  isRead?: boolean;
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
  markReadStyle: {
    color: STORM_BLUE,
    fontSize: 14,
    paddingTop: 14,
    paddingBottom: 23,
  },
});

function MessageList({ isRead }: PropType) {
  const { courierClient } = useCourier();
  const { getMessages } = Messages({ client: courierClient });
  const [{ messages, isLoading, startCursor }, dispatch] = useReducer(
    messagesReducer,
    messagesInitialState,
  );
  const {
    emptyState: { textColor, text: emptyText },
  } = useBrand();
  // const { openModal, selectMessage } = useBottomModal();

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

  const getMessagesInit = () => dispatch(getMessagesInitAction());
  const getMessageSuccess = ({
    payload,
  }: {
    payload: GetMessagesSuccessPayloadType;
  }) => dispatch(getMessagesSuccessAction({ payload }));
  const messagesStopLoading = () => dispatch(messageStopLoadingAction());

  const getQueryParams = () => {
    if (typeof isRead === 'undefined') return undefined;
    return { isRead };
  };

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
  }, [isRead]);

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
          data={messages}
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
                <TouchableOpacity>
                  <Text style={styles.markReadStyle}>Mark as read</Text>
                </TouchableOpacity>
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
};

export default MessageList;
