import React, {
  useEffect,
  useMemo,
  useState,
  createContext,
  useContext,
} from 'react';
import {
  Brands,
  createCourierClient,
  Messages,
} from '@trycourier/client-graphql';
import type { Client } from 'urql';
import { ICourierMessage, useCourier } from '@trycourier/react-provider';
import { useMessageHook } from '../hooks/useMessage/MessagesStore/useMessagesHook';
import type { MessageType } from '../hooks/useMessage/MessagesStore/Messagestypes';
import type { BrandConfig } from './Brands/brands.types';
import { brandInitialConfig } from './Brands/initialConfig';
import { AllNotificationsContext } from './AllNotificationsContext';
import { UnreadNotificationsContext } from './UnreadNotificationsContext';
import { useBellIcon } from './BellIconContextProvider';

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
  onNewMessage?: (_m: ICourierMessage) => void;
};

const CourierContext = createContext<CourierContextType>({
  brandConfig: brandInitialConfig,
  isBrandLoading: false,
  isBrandLoadingError: false,
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

  const {
    notificationsCount: unreadNotificationsCount,
    setNotificationsCount: setUnreadNotificationsCount,
    getNotificationsInit: getUnreadNotificationsInit,
    getNotificationsSuccess: getUnreadNotificationsSuccess,
    notificationsStopLoading: unreadNotificationsStopLoading,
    notifications: unreadNotifications,
    isLoading: unreadNotificationsIsLoading,
    startCursor: unreadNotificationsStartCursor,
    setNotifications: setUnreadNotifications,
    fetchNotification: fetchUnreadNotifications,
    fetchMoreNotifications: fetchMoreUnreadNotifications,
  } = useMessageHook({
    notificationType: 'unread',
    clientKey,
    userId,
  });

  const {
    notificationsCount: allNotificationsCount,
    setNotificationsCount: setAllNotificationsCount,
    getNotificationsInit: getAllNotificationsInit,
    getNotificationsSuccess: getAllNotificationsSuccess,
    notificationsStopLoading: allNotificationsStopLoading,
    notifications: allNotifications,
    isLoading: allNotificationsIsLoading,
    startCursor: allNotificationsStartCursor,
    setNotifications: setAllNotifications,
    fetchNotification: fetchAllNotifications,
    fetchMoreNotifications: fetchMoreAllCategoryNotifications,
  } = useMessageHook({
    notificationType: 'all',
    clientKey,
    userId,
  });

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
  const { nudgeBellIcon } = useBellIcon();

  const updateUnreadMessageCount = async () => {
    try {
      const updatedUnreadMessageCount = await getMessageCount({
        isRead: false,
      });
      setUnreadNotificationsCount(updatedUnreadMessageCount);
    } catch (e) {
      console.error({ e });
    }
  };

  useEffect(() => {
    courier.transport.intercept((message: ICourierMessage) => {
      // converting ICourierMessage to MessageType
      const newMessage = ImessageToMessageTypeConverter(message);
      console.log('newMessageType', newMessage);
      setAllNotifications([newMessage, ...allNotifications]);
      setUnreadNotifications([newMessage, ...unreadNotifications]);
      nudgeBellIcon();
      setUnreadNotificationsCount((prev) => prev + 1);
      setAllNotificationsCount((prev) => prev + 1);
      if (typeof onNewMessage === 'function') onNewMessage(message);
    });
  }, [
    JSON.stringify(allNotifications),
    JSON.stringify(unreadNotifications),
    unreadNotificationsCount,
    allNotificationsCount,
  ]);

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
    <UnreadNotificationsContext.Provider
      value={{
        getNotificationsInit: getUnreadNotificationsInit,
        getNotificationsSuccess: getUnreadNotificationsSuccess,
        stopLoading: unreadNotificationsStopLoading,
        notifications: unreadNotifications,
        startCursor: unreadNotificationsStartCursor,
        isLoading: unreadNotificationsIsLoading,
        notificationsCount: unreadNotificationsCount,
        setNotificationsCount: setUnreadNotificationsCount,
        fetchNotification: fetchUnreadNotifications,
        fetchMoreNotifications: fetchMoreUnreadNotifications,
        setNotifications: setUnreadNotifications,
      }}
    >
      <AllNotificationsContext.Provider
        value={{
          getNotificationsInit: getAllNotificationsInit,
          getNotificationsSuccess: getAllNotificationsSuccess,
          stopLoading: allNotificationsStopLoading,
          notifications: allNotifications,
          startCursor: allNotificationsStartCursor,
          isLoading: allNotificationsIsLoading,
          notificationsCount: allNotificationsCount,
          setNotificationsCount: setAllNotificationsCount,
          fetchNotification: fetchAllNotifications,
          fetchMoreNotifications: fetchMoreAllCategoryNotifications,
          setNotifications: setAllNotifications,
        }}
      >
        <CourierContext.Provider
          value={{
            courierClient,
            brandConfig,
            isBrandLoading,
            isBrandLoadingError,
            onNewMessage,
          }}
        >
          {children}
        </CourierContext.Provider>
      </AllNotificationsContext.Provider>
    </UnreadNotificationsContext.Provider>
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
