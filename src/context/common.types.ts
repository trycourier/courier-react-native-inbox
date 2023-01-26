import type {
  GetMessagesSuccessPayloadType,
  MessageType,
} from '../hooks/useMessage/MessagesStore/Messagestypes';

export type NotificationsContextType = {
  getNotificationsInit: () => void;
  getNotificationsSuccess: (_p: {
    payload: GetMessagesSuccessPayloadType;
  }) => void;
  stopLoading: () => void;
  notifications: MessageType[];
  startCursor: string | null | undefined;
  isLoading: boolean;
  setNotificationsCount: (_count: number | ((_prev: number) => number)) => void;
  notificationsCount: number;
  fetchNotification: (_p: { prevMessages: MessageType[] }) => Promise<void>;
  fetchMoreNotifications: () => void;
  setNotifications: (_u: MessageType[]) => void;
};
