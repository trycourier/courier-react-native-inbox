import { createContext, useContext } from 'react';
import type { NotificationsContextType } from './common.types';

const defaultNotificationsContextValue: NotificationsContextType = {
  getNotificationsInit: () => {},
  getNotificationsSuccess: () => {},
  stopLoading: () => {},
  notifications: [],
  startCursor: null,
  isLoading: false,
  notificationsCount: 0,
  setNotificationsCount: () => {},
  fetchNotification: () => Promise.resolve(),
  fetchMoreNotifications: () => {},
  setNotifications: () => {},
};

export const AllNotificationsContext = createContext<NotificationsContextType>(
  defaultNotificationsContextValue
);

export const useAllNotifications = () => {
  const {
    getNotificationsInit: getAllNotificationsInit,
    getNotificationsSuccess: getAllNotificationsSuccess,
    stopLoading: allNotificationsStopLoading,
    notifications: allNotifications,
    startCursor: allNotificationsStartCursor,
    isLoading: allNotificationsIsLoading,
    setNotificationsCount: setAllNotificationsCount,
    notificationsCount: allNotificationsCount,
    fetchNotification: fetchAllNotifications,
    fetchMoreNotifications: fetchMoreAllCategoryNotifications,
    setNotifications: setAllNotifications,
  } = useContext(AllNotificationsContext);
  return {
    getAllNotificationsInit,
    getAllNotificationsSuccess,
    allNotificationsStopLoading,
    allNotifications,
    allNotificationsStartCursor,
    allNotificationsIsLoading,
    setAllNotificationsCount,
    allNotificationsCount,
    fetchAllNotifications,
    fetchMoreAllCategoryNotifications,
    setAllNotifications,
  };
};
