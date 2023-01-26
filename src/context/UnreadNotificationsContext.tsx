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

export const UnreadNotificationsContext =
  createContext<NotificationsContextType>(defaultNotificationsContextValue);

export const useUnreadNotifications = () => {
  const {
    getNotificationsInit: getUnreadNotificationsInit,
    getNotificationsSuccess: getUnreadNotificationsSuccess,
    stopLoading: unreadNotificationsStopLoading,
    notifications: unreadNotifications,
    startCursor: unreadNotificationsStartCursor,
    isLoading: unreadNotificationsIsLoading,
    setNotificationsCount: setUnreadNotificationsCount,
    notificationsCount: unreadNotificationsCount,
    fetchNotification: fetchUnreadNotifications,
    fetchMoreNotifications: fetchMoreUnreadNotifications,
    setNotifications: setUnreadNotifications,
  } = useContext(UnreadNotificationsContext);
  return {
    getUnreadNotificationsInit,
    getUnreadNotificationsSuccess,
    unreadNotificationsStopLoading,
    unreadNotifications,
    unreadNotificationsStartCursor,
    unreadNotificationsIsLoading,
    unreadNotificationsCount,
    setUnreadNotificationsCount,
    fetchUnreadNotifications,
    fetchMoreUnreadNotifications,
    setUnreadNotifications,
  };
};
