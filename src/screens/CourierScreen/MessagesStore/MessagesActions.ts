import type {
  GetMessagesSuccessPayloadType,
  MessageType,
} from './Messagestypes';

export const GET_MESSAGES_INIT: 'GET_MESSAGES_INIT' = 'GET_MESSAGES_INIT';
export const GET_MESSAGES_SUCCESS: 'GET_MESSAGES_SUCCESS' =
  'GET_MESSAGES_SUCCESS';
export const MESSAGES_STOP_LOADING: 'MESSAGES_STOP_LOADING' =
  'MESSAGES_STOP_LOADING';
export const SET_MESSAGES: 'SET_MESSAGES' = 'SET_MESSAGES';

export const getMessagesInitAction = () => ({ type: GET_MESSAGES_INIT });
export const getMessagesSuccessAction = ({
  payload,
}: {
  payload: GetMessagesSuccessPayloadType;
}) => ({ type: GET_MESSAGES_SUCCESS, payload });
export const messageStopLoadingAction = () => ({ type: MESSAGES_STOP_LOADING });
export const setMessagesAction = ({
  payload,
}: {
  payload: { messages: MessageType[] };
}) => ({ type: SET_MESSAGES, payload });
