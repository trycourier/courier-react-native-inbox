import { useMemo, useReducer } from 'react';
import { Messages, createCourierClient } from '@trycourier/client-graphql';
import {
  getMessagesInitAction,
  getMessagesSuccessAction,
  messageStopLoadingAction,
  setMessageCountAction,
  setMessagesAction,
} from './MessagesActions';
import { messagesInitialState, messagesReducer } from './MessagesReducer';
import type {
  GetMessagesSuccessPayloadType,
  MessageType,
} from './Messagestypes';

type NotificationType = 'unread' | 'all';

const getQueryParams = (notificationType: NotificationType) => {
  if (notificationType === 'all') return undefined;
  return { isRead: false };
};

export const useMessageHook = ({
  notificationType,
  clientKey,
  userId,
}: {
  notificationType: NotificationType;
  clientKey: string;
  userId: string;
}) => {
  const courierClient = useMemo(
    () =>
      createCourierClient({
        clientKey,
        userId,
      }),
    []
  );

  const { getMessageCount, getMessages } = Messages({ client: courierClient });
  const [
    {
      messages: notifications,
      isLoading,
      startCursor,
      messageCount: notificationsCount,
    },
    dispatch,
  ] = useReducer(messagesReducer, messagesInitialState);

  const getNotificationsInit = () => dispatch(getMessagesInitAction());

  const getNotificationsSuccess = ({
    payload,
  }: {
    payload: GetMessagesSuccessPayloadType;
  }) => dispatch(getMessagesSuccessAction({ payload }));

  const notificationsStopLoading = () => dispatch(messageStopLoadingAction());

  const setNotificationsCount = (
    count: number | ((_prev: number) => number)
  ) => {
    switch (typeof count) {
      case 'number':
        dispatch(
          setMessageCountAction({
            payload: { messageCount: count },
          })
        );
        break;
      case 'function':
        dispatch(
          setMessageCountAction({
            payload: { messageCount: count(notificationsCount) },
          })
        );
        break;
      default:
    }
  };

  const setNotifications = (updatedNotifications: MessageType[]) =>
    dispatch(
      setMessagesAction({
        payload: { messages: [...updatedNotifications] },
      })
    );

  async function fetchNotification({
    prevMessages,
  }: {
    prevMessages: MessageType[];
  }) {
    try {
      if (!startCursor) {
        const messageCount = await getMessageCount(
          getQueryParams(notificationType)
        );
        setNotificationsCount(messageCount);
      }
      getNotificationsInit();
      const messagesResp = await getMessages(
        getQueryParams(notificationType),
        startCursor ?? undefined
      );
      if (messagesResp) {
        const payload = {
          ...messagesResp,
          messages: [...prevMessages, ...messagesResp.messages],
        };
        getNotificationsSuccess({ payload });
      }
    } catch (err) {
      notificationsStopLoading();
    }
  }

  const fetchMoreNotifications = () => {
    if (startCursor && !isLoading) {
      fetchNotification({ prevMessages: [...notifications] });
    }
  };

  return {
    getNotificationsInit,
    notifications,
    isLoading,
    startCursor,
    notificationsCount,
    setNotificationsCount,
    getNotificationsSuccess,
    notificationsStopLoading,
    setNotifications,
    fetchNotification,
    fetchMoreNotifications,
  };
};
