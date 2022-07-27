import { useEffect, useMemo, useReducer, useState } from 'react';
import { Events, Messages } from '@trycourier/client-graphql';
import { useCourier } from '@trycourier/react-provider';
import type { ICourierMessage } from '@trycourier/react-provider';
import { useReactNativeCourier } from '../../context/CourierReactNativeProvider';
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
  messagesStartLoadingAction,
  getMessagesSuccessAction,
  messageStopLoadingAction,
  setMessagesAction,
} from './MessagesStore/MessagesActions';

type Props = {
  isRead: isReadType;
  setMessagesCount: React.Dispatch<React.SetStateAction<number>>;
};

const getQueryParams = (isRead: isReadType) => {
  if (isRead === 'all') return undefined;
  return { isRead };
};

const ImessageToMessageTypeConverter = (
  message: ICourierMessage
): MessageType => {
  const convertedMessage: MessageType = {
    content: {
      title: message.title as string,
      body: message.body as string,
      trackingIds: message.data?.trackingIds ?? {},
      blocks: message.blocks || [],
      __typename: '',
    },
    id: message.data?.trackingUrl || Math.floor(Math.random() * 1e7).toString(),
    messageId:
      message.data?.trackingUrl || Math.floor(Math.random() * 1e7).toString(),
    created: new Date().toISOString(),
    read: false,
    __typename: '',
  };
  return convertedMessage;
};

const useMessage = ({ isRead, setMessagesCount }: Props) => {
  const { courierClient } = useReactNativeCourier();
  const { getMessages, getMessageCount } = Messages({ client: courierClient });
  const { trackEvent } = Events({ client: courierClient });
  const courier = useCourier();

  const [{ messages, isLoading, startCursor }, dispatch] = useReducer(
    messagesReducer,
    messagesInitialState
  );
  const [selectedMessage, setSelectedMessage] = useState<
    MessageType | undefined
  >();

  useEffect(() => {
    courier.transport.intercept((message: ICourierMessage) => {
      // converting ICourierMessage to MessageType
      const newMessage = ImessageToMessageTypeConverter(message);
      const updatedMessages = [newMessage, ...messages];
      dispatch(setMessagesAction({ payload: { messages: updatedMessages } }));
      setMessagesCount((prev) => prev + 1);
      return message;
    });
  });

  const getMessagesInit = () => dispatch(messagesStartLoadingAction());
  const getMessageSuccess = ({
    payload,
  }: {
    payload: GetMessagesSuccessPayloadType;
  }) => dispatch(getMessagesSuccessAction({ payload }));
  const messagesStopLoading = () => dispatch(messageStopLoadingAction());

  const resetMessages = () => {
    setMessagesCount(0);
    getMessageSuccess({
      payload: { appendMessages: false, messages: [], startCursor: null },
    });
  };

  async function fetchData(fetchAfter?: string) {
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

  const updateMessageRead = ({
    read,
    selectedId,
  }: {
    read: boolean;
    selectedId: string;
  }) => {
    const updatedMessages = messages.map((message) => {
      if (message.id === selectedId) {
        if (isRead === false && read === true) {
          setMessagesCount((prev) => prev - 1);
        }
        return { ...message, read };
      }
      return message;
    });
    dispatch(setMessagesAction({ payload: { messages: updatedMessages } }));
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
