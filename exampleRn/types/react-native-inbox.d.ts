type SizeType = 'sm' | 'md' | 'lg';
declare module '@trycourier/react-native-inbox' {
  export const CourierProvider: ({
    children: _c,
    clientKey: _ck,
    userId: _u,
    brandId: _b,
  }: {
    children: JSX.Element | JSX.Element[];
    clientKey: string;
    userId: string;
    brandId: string;
  }) => JSX.Element;
  export const CourierScreen: () => JSX.Element;
  export const BellIcon: ({
    size: _s,
    showUnreadMessageCount: _sh,
    render: _r,
    onMessage: _o,
  }: {
    size?: SizeType;
    showUnreadMessageCount?: boolean;
    render?: (_numberOfUnreadMessages: number) => JSX.Element;
    onMessage?: (_numberOfUnreadMessages: number) => void;
  }) => JSX.Element;
}
