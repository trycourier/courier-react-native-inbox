import type { IActionBlock, ITextBlock } from '@trycourier/react-provider';
import type {
  MESSAGES_START_LOADING,
  GET_MESSAGES_SUCCESS,
  MESSAGES_STOP_LOADING,
  SET_MESSAGES,
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
  __typename: string;
};
export interface MessageType {
  id: string;
  messageId: string;
  created: string;
  read: boolean;
  tags?: null[] | null;
  content: Content;
  __typename: string;
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

export interface MessagesReducerState extends GetMessagesSuccessResp {
  isLoading: boolean;
}

export interface GetMessages {
  type: typeof MESSAGES_START_LOADING;
}

export interface GetMessagesSuccessPayloadType
  extends Omit<MessagesReducerState, 'isLoading'> {}

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
  | SetMessages;

export type isReadType = boolean | 'all';
