import { useMemo, useState } from 'react';
import { Events, Messages } from '@trycourier/client-graphql';
import {
  useCourierProviderMessage,
  useReactNativeCourier,
} from '../../context/CourierReactNativeProvider';
import type {
  isReadType,
  MessageType,
  TrackingIds,
} from './MessagesStore/Messagestypes';

type Props = {
  isRead: isReadType;
};

const getQueryParams = (isRead: isReadType) => {
  if (isRead === 'all') return undefined;
  return { isRead };
};

const useMessage = ({ isRead }: Props) => {
  const { courierClient } = useReactNativeCourier();
  const { getMessages, getMessageCount } = Messages({ client: courierClient });
  const { trackEvent } = Events({ client: courierClient });
  const {
    getMessageSuccess,
    getMessagesInit,
    messagesStopLoading,
    messages,
    startCursor,
    isLoading,
    updateMessageRead,
    setMessagesCount,
  } = useCourierProviderMessage();

  const [selectedMessage, setSelectedMessage] = useState<
    MessageType | undefined
  >();

  const resetMessages = () => {
    getMessageSuccess({
      payload: { appendMessages: false, messages: [], startCursor: null },
    });
  };

  async function fetchData({
    fetchAfter,
    prevMessages,
  }: {
    fetchAfter?: string;
    prevMessages: MessageType[];
  }) {
    try {
      if (!fetchAfter) {
        const messageCount = await getMessageCount(getQueryParams(isRead));
        setMessagesCount(messageCount);
      }
      getMessagesInit();
      const messagesResp = await getMessages(
        getQueryParams(isRead),
        fetchAfter
      );
      if (messagesResp) {
        const payload = {
          ...messagesResp,
          messages: [...prevMessages, ...messagesResp.messages],
        };
        getMessageSuccess({ payload });
      }
    } catch (err) {
      messagesStopLoading();
    }
  }

  const fetchMoreMessages = () => {
    if (startCursor !== null && !isLoading) {
      fetchData({ fetchAfter: startCursor, prevMessages: messages });
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
      const selectedTrackingId = selectedMessage.content.trackingIds[key];
      if (typeof selectedTrackingId === 'undefined') return Promise.reject();
      try {
        await trackEvent(selectedTrackingId);
        updateMessageRead({
          read: updatedReadValue,
          selectedId: selectedMessage.id,
          isRead,
        });
        return Promise.resolve({ success: true });
      } catch (e) {
        console.log({ e });
        return Promise.reject();
      }
    };

  const markAsReadEvent = genericReadUnreadEvent({
    key: 'readTrackingId',
    updatedReadValue: true,
  });
  const markAsUnreadEvent = genericReadUnreadEvent({
    key: 'unreadTrackingId',
    updatedReadValue: false,
  });

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
    updateMessageRead,
    resetMessages,
    fetchData,
  };
};

export default useMessage;
