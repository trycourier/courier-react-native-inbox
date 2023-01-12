import type { IActionBlock, ITextBlock } from '@trycourier/react-provider';
import type {
  GET_MESSAGES_INIT,
  GET_MESSAGES_SUCCESS,
  MESSAGES_STOP_LOADING,
  SET_MESSAGES,
  SET_MESSAGE_COUNT,
} from './MessagesActions';

export interface TrackingIds {
  archiveTrackingId?: string;
  clickTrackingId?: string;
  deliverTrackingId?: string;
  readTrackingId?: string;
  unreadTrackingId?: string;
  channelTrackingId?: string;
  __typename?: string;
}

type Content = {
  title: string;
  body: string;
  blocks?: (ITextBlock | IActionBlock)[] | null;
  data?: null;
  trackingIds: TrackingIds;
  __typename?: string;
};
export interface MessageType {
  id: string;
  messageId: string;
  created: string;
  read?: boolean;
  tags?: string[] | null;
  content: Content;
  __typename?: string;
}

export interface GetMessagesSuccessResp {
  appendMessages: boolean;
  messages: MessageType[];
  startCursor?: null | string;
}

export interface SetMessages {
  type: typeof SET_MESSAGES;
  payload: { messages: MessageType[] };
}

export interface UpdateMessageCount {
  type: typeof SET_MESSAGE_COUNT;
  payload: { messageCount: number };
}

export interface MessagesReducerState extends GetMessagesSuccessResp {
  isLoading: boolean;
  messageCount: number;
}

export interface GetMessages {
  type: typeof GET_MESSAGES_INIT;
}

export interface GetMessagesSuccessPayloadType
  extends Omit<MessagesReducerState, 'isLoading' | 'messageCount'> {}

export interface GetMessagesSuccess {
  type: typeof GET_MESSAGES_SUCCESS;
  payload: GetMessagesSuccessPayloadType;
}

export interface MessagesStopLoading {
  type: typeof MESSAGES_STOP_LOADING;
}

export type InterfaceMessageReducerActionType =
  | GetMessages
  | GetMessagesSuccess
  | MessagesStopLoading
  | SetMessages
  | UpdateMessageCount;

export type isReadType = boolean | 'all';
