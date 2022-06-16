import { useEffect, useMemo, useReducer, useState } from 'react';
import { Events, Messages } from '@trycourier/client-graphql';
import { useCourier } from '../../context/CourierProvider';
import {
  messagesInitialState,
  messagesReducer,
} from './MessagesStore/MessagesReducer';
import type {
  GetMessagesSuccessPayloadType,
  isReadType,
  MessageType,
  TrackingIds,
} from './MessagesStore/Messagestypes';
import {
  getMessagesInitAction,
  getMessagesSuccessAction,
  messageStopLoadingAction,
  setMessagesAction,
} from './MessagesStore/MessagesActions';

type Props = {
  isRead: isReadType;
};

const getQueryParams = (isRead: isReadType) => {
  if (isRead === 'all') return undefined;
  return { isRead };
};

const useMessage = ({ isRead }: Props) => {
  const { courierClient } = useCourier();
  const { getMessages } = Messages({ client: courierClient });
  const { trackEvent } = Events({ client: courierClient });

  const [{ messages, isLoading, startCursor }, dispatch] = useReducer(
    messagesReducer,
    messagesInitialState
  );
  const [selectedMessage, setSelectedMessage] = useState<
    MessageType | undefined
  >();

  const getMessagesInit = () => dispatch(getMessagesInitAction());
  const getMessageSuccess = ({
    payload,
  }: {
    payload: GetMessagesSuccessPayloadType;
  }) => dispatch(getMessagesSuccessAction({ payload }));
  const messagesStopLoading = () => dispatch(messageStopLoadingAction());

  const resetMessages = () => {
    getMessageSuccess({
      payload: { appendMessages: false, messages: [], startCursor: null },
    });
  };

  async function fetchData(fetchAfter?: string) {
    try {
      getMessagesInit();
      const messagesResp = await getMessages(
        getQueryParams(isRead),
        fetchAfter
      );
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

  const fetchMoreMessages = () => {
    if (startCursor !== null) {
      fetchData(startCursor);
    }
  };

  const genericReadUnreadEvent =
    ({
      key,
      updatedReadValue,
    }: {
      key: keyof TrackingIds;
      updatedReadValue: boolean;
    }) =>
    async () => {
      if (typeof selectedMessage === 'undefined') {
        return Promise.reject();
      }
      try {
        await trackEvent(selectedMessage.content.trackingIds[key]);
        const updatedMessages = messages.map((message) => {
          if (message.id === selectedMessage.id)
            return { ...message, read: updatedReadValue };
          return message;
        });
        dispatch(setMessagesAction({ payload: { messages: updatedMessages } }));
        return Promise.resolve({ success: true });
      } catch (e) {
        console.log({ e });
        return Promise.reject();
      }
    };

  console.log('messages', { messages });

  const markAsReadEvent = genericReadUnreadEvent({
    key: 'readTrackingId',
    updatedReadValue: true,
  });
  const markAsUnreadEvent = genericReadUnreadEvent({
    key: 'unreadTrackingId',
    updatedReadValue: false,
  });

  useEffect(() => {
    resetMessages();
    fetchData();
    return resetMessages;
  }, []);

  const renderMessages = useMemo(() => {
    if (isRead === 'all') {
      return messages;
    }
    if (isRead === false) {
      return messages.filter((message) => !message.read);
    }
    return messages;
  }, [JSON.stringify(messages)]);

  return {
    selectedMessage,
    setSelectedMessage,
    isLoading,
    markAsReadEvent,
    markAsUnreadEvent,
    renderMessages,
    fetchMoreMessages,
  };
};

export default useMessage;
