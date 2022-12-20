type SizeType = 'sm' | 'md' | 'lg';
declare module '@trycourier/react-native-inbox' {
  export const CourierProvider: (_props: {
    children: JSX.Element | JSX.Element[];
    clientKey: string;
    userId: string;
    brandId: string;
  }) => JSX.Element;
  export const CourierScreen: () => JSX.Element;
  export const BellIcon: (_props: {
    size?: SizeType;
    showUnreadMessageCount?: boolean;
    render?: (_numberOfUnreadMessages: number) => JSX.Element;
    onMessage?: (_numberOfUnreadMessages: number) => void;
  }) => JSX.Element;
}
