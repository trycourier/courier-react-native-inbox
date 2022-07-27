import {
  SET_MESSAGES,
  MESSAGES_START_LOADING,
  GET_MESSAGES_SUCCESS,
  MESSAGES_STOP_LOADING,
} from './MessagesActions';
import type {
  InterfaceMessageReducerActionType,
  MessagesReducerState,
} from './Messagestypes';

export const messagesInitialState: MessagesReducerState = {
  isLoading: false,
  messages: [],
  startCursor: undefined,
  appendMessages: false,
};

export const messagesReducer = (
  state: MessagesReducerState = { ...messagesInitialState },
  action: InterfaceMessageReducerActionType
) => {
  switch (action.type) {
    case MESSAGES_START_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case GET_MESSAGES_SUCCESS:
      return {
        ...state,
        ...action.payload,
        isLoading: false,
      };
    case MESSAGES_STOP_LOADING:
      return {
        ...state,
        isLoading: false,
      };
    case SET_MESSAGES:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return {
        ...state,
      };
  }
};
