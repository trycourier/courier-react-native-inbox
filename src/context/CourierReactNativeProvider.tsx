import React, {
  useEffect,
  useMemo,
  useState,
  createContext,
  useContext,
  useRef,
  useReducer,
} from 'react';
import {
  Brands,
  createCourierClient,
  Messages,
} from '@trycourier/client-graphql';
import type { Client } from 'urql';
import { Animated, Easing } from 'react-native';
import { ICourierMessage, useCourier } from '@trycourier/react-provider';
import type {
  GetMessagesSuccessPayloadType,
  isReadType,
  MessageType,
} from '../hooks/useMessage/MessagesStore/Messagestypes';
import {
  messagesInitialState,
  messagesReducer,
} from '../hooks/useMessage/MessagesStore/MessagesReducer';
import {
  getMessagesInitAction,
  getMessagesSuccessAction,
  messageStopLoadingAction,
  setMessagesAction,
} from '../hooks/useMessage/MessagesStore/MessagesActions';
import type { BrandConfig } from './Brands/brands.types';
import { brandInitialConfig } from './Brands/initialConfig';

const LEFT_DURATION = 100;
const RIGHT_DURATION = 120;
const CENTER_DURATION = 75;
export const DOT_DELAY = LEFT_DURATION + RIGHT_DURATION + CENTER_DURATION;

export type Props = {
  children: JSX.Element | JSX.Element[];
  userId: string;
  clientKey: string;
  brandId: string;
  onNewMessage?: (_m: ICourierMessage) => void;
};

type CourierContextType = {
  courierClient?: Client;
  brandConfig: BrandConfig;
  isBrandLoading: boolean;
  isBrandLoadingError?: boolean;
  spin?: Animated.AnimatedInterpolation;
  unReadBellIconMessageCount: number;
  nudgeBellIcon: () => void;
  setUnReadBellIconMessageCount: React.Dispatch<React.SetStateAction<number>>;
  onNewMessage?: (_m: ICourierMessage) => void;
  getMessagesInit: () => void;
  getMessageSuccess: (_p: { payload: GetMessagesSuccessPayloadType }) => void;
  messagesStopLoading: () => void;
  messages: MessageType[];
  startCursor: string | null | undefined;
  isLoading: boolean;
  updateMessageRead: (_p: {
    read: boolean;
    selectedId: string;
    isRead: isReadType;
  }) => void;
  messagesCount: number;
  setMessagesCount: React.Dispatch<React.SetStateAction<number>>;
};

const CourierContext = createContext<CourierContextType>({
  brandConfig: brandInitialConfig,
  isBrandLoading: false,
  isBrandLoadingError: false,
  unReadBellIconMessageCount: 0,
  nudgeBellIcon: () => {},
  setUnReadBellIconMessageCount: () => {},
  getMessagesInit: () => {},
  getMessageSuccess: () => {},
  messagesStopLoading: () => {},
  messages: [],
  startCursor: null,
  isLoading: false,
  updateMessageRead: () => {},
  messagesCount: 0,
  setMessagesCount: () => {},
});

const verifyAllValidProperties = (obj: BrandConfig) =>
  Object.keys(brandInitialConfig).every(
    (key) =>
      Object.prototype.hasOwnProperty.call(obj, key) &&
      Boolean(obj[key as keyof typeof brandInitialConfig])
  );

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
function CourierReactNativeProvider({
  children,
  userId,
  clientKey,
  brandId,
  onNewMessage,
}: Props) {
  const [brandConfig, setBrandsConfig] =
    useState<BrandConfig>(brandInitialConfig);
  const [isBrandLoading, setIsBrandLoading] = useState(true);
  const [isBrandLoadingError, setIsBrandLoadingError] = useState(false);
  const [unReadBellIconMessageCount, setUnReadBellIconMessageCount] =
    useState(0);
  const [messagesCount, setMessagesCount] = useState(0);

  const courierClient = useMemo(
    () =>
      createCourierClient({
        clientKey,
        userId,
      }),
    []
  );

  const brandApis = Brands({ client: courierClient });
  const { getMessageCount } = Messages({ client: courierClient });
  const courier = useCourier();
  const [{ messages, isLoading, startCursor }, dispatch] = useReducer(
    messagesReducer,
    messagesInitialState
  );

  const spinValue = useRef(new Animated.Value(0)).current;

  const stable = () =>
    Animated.timing(spinValue, {
      toValue: 0,
      useNativeDriver: true,
      duration: CENTER_DURATION,
      easing: Easing.ease,
    }).start();

  const goRight = () =>
    Animated.timing(spinValue, {
      toValue: -9,
      useNativeDriver: true,
      duration: RIGHT_DURATION,
      easing: Easing.ease,
    }).start(stable);

  const goLeft = () =>
    Animated.timing(spinValue, {
      toValue: 10,
      useNativeDriver: true,
      duration: LEFT_DURATION,
      easing: Easing.ease,
    }).start(goRight);

  const spin = spinValue.interpolate({
    inputRange: [-360, 360],
    outputRange: ['-360deg', '360deg'],
  });

  const updateUnreadMessageCount = async () => {
    try {
      const updatedUnreadMessageCount = await getMessageCount({
        isRead: false,
      });
      setUnReadBellIconMessageCount(updatedUnreadMessageCount);
    } catch (e) {
      console.error({ e });
    }
  };

  const nudgeBellIcon = () => {
    goLeft();
  };

  useEffect(() => {
    courier.transport.intercept((message: ICourierMessage) => {
      // converting ICourierMessage to MessageType
      const newMessage = ImessageToMessageTypeConverter(message);
      const updatedMessages = [newMessage, ...messages];
      dispatch(setMessagesAction({ payload: { messages: updatedMessages } }));
      nudgeBellIcon();
      setUnReadBellIconMessageCount((prev) => prev + 1);
      setMessagesCount((prev) => prev + 1);
      if (typeof onNewMessage === 'function') onNewMessage(message);
    });
  }, [JSON.stringify(messages)]);

  const getMessagesInit = () => dispatch(getMessagesInitAction());
  const getMessageSuccess = ({
    payload,
  }: {
    payload: GetMessagesSuccessPayloadType;
  }) => dispatch(getMessagesSuccessAction({ payload }));
  const messagesStopLoading = () => dispatch(messageStopLoadingAction());
  const updateMessageRead = ({
    read,
    selectedId,
    isRead,
  }: {
    read: boolean;
    selectedId: string;
    isRead: isReadType;
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

  useEffect(() => {
    const getBrands = async () => {
      setIsBrandLoading(true);
      try {
        const brands = await brandApis.getBrand(brandId);
        if (!brands || !verifyAllValidProperties(brands)) {
          throw new Error('Invalid brand value');
        }
        const typedBrands: BrandConfig = brands;
        setBrandsConfig(typedBrands);
      } catch (err) {
        console.log({ err });
        setIsBrandLoadingError(true);
      } finally {
        setIsBrandLoading(false);
      }
    };
    getBrands();
    updateUnreadMessageCount();
  }, []);

  return (
    <CourierContext.Provider
      value={{
        courierClient,
        brandConfig,
        isBrandLoading,
        isBrandLoadingError,
        spin,
        unReadBellIconMessageCount,
        nudgeBellIcon,
        setUnReadBellIconMessageCount,
        onNewMessage,
        getMessagesInit,
        getMessageSuccess,
        messagesStopLoading,
        messages,
        startCursor,
        isLoading,
        updateMessageRead,
        messagesCount,
        setMessagesCount,
      }}
    >
      {children}
    </CourierContext.Provider>
  );
}

CourierReactNativeProvider.defaultProps = {
  onNewMessage: undefined,
};

export default CourierReactNativeProvider;

export const useReactNativeCourier = () => {
  const { courierClient, onNewMessage } = useContext(CourierContext);
  return { courierClient, onNewMessage };
};

export const useBrand = () => {
  const {
    brandConfig: {
      colors,
      inapp: {
        emptyState,
        borderRadius,
        widgetBackground,
        disableCourierFooter,
      },
    },
    isBrandLoading,
    isBrandLoadingError,
  } = useContext(CourierContext);
  return {
    colors,
    emptyState,
    borderRadius,
    widgetBackground,
    isBrandLoading,
    disableCourierFooter,
    isBrandLoadingError,
  };
};

export const useBellIcon = () => {
  const {
    spin,
    unReadBellIconMessageCount,
    nudgeBellIcon,
    setUnReadBellIconMessageCount,
  } = useContext(CourierContext);
  return {
    spin,
    unReadBellIconMessageCount,
    nudgeBellIcon,
    setUnReadBellIconMessageCount,
  };
};

export const useCourierProviderMessage = () => {
  const {
    getMessagesInit,
    getMessageSuccess,
    messagesStopLoading,
    messages,
    startCursor,
    isLoading,
    updateMessageRead,
    messagesCount,
    setMessagesCount,
  } = useContext(CourierContext);
  return {
    getMessageSuccess,
    getMessagesInit,
    messagesStopLoading,
    messages,
    startCursor,
    isLoading,
    updateMessageRead,
    messagesCount,
    setMessagesCount,
  };
};
