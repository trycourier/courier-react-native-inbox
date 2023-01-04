import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict';
import type { MessageType } from 'src/hooks/useMessage/MessagesStore/Messagestypes';
import type { IActionBlock, ITextBlock } from '@trycourier/react-provider';
import { SvgDot } from '../SvgDot';
import { SEMI_BOLD } from '../../constants/fontSize';
import { GRAY } from '../../constants/colors';
import { BurgerIcon } from '../BurgerIcon';
import { useBrand } from '../../context/CourierReactNativeProvider';
import { OpenButtonUrl } from '../OpenButtonUrl';

const styles = StyleSheet.create({
  overAll: {
    backgroundColor: '#F9FAFB',
    borderRadius: 4,
    marginBottom: 6,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },

  headerTextStyle: {
    fontWeight: SEMI_BOLD,
    color: 'black',
  },
  subHeaderStyle: {
    fontSize: 12,
    color: GRAY,
  },
  dotStyle: {
    marginLeft: 16,
    marginRight: 16,
  },
  fromNowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fromNowText: {
    fontSize: 10,
    color: GRAY,
  },
  actionButtonContainerStyle: {
    marginTop: 8,
    flexDirection: 'row',
  },
  notificationBodyContainer: { flex: 1 },
  flexRow: {
    flexDirection: 'row',
  },
  firstMessageMargin: {
    marginTop: 6,
  },
});

type Prop = {
  onPress: (_msg: MessageType) => void;
  message: MessageType;
  onActionSuccess: () => void;
  isFirst?: boolean;
};

function Message({ onPress, message, onActionSuccess, isFirst }: Prop) {
  const {
    content: { title, blocks },
    read,
    created: createdAt,
  } = message;
  const {
    colors: { primary },
  } = useBrand();

  const getFormattedDate = () =>
    formatDistanceToNowStrict(new Date(createdAt), { addSuffix: false });

  const renderBody = (blocks?.find(
    (block) => block.type === 'text'
  ) as ITextBlock) ?? { text: '' };
  const { url: actionButtonUrl = '', text: actionButtonText } = (blocks?.find(
    (block) => block.type === 'action'
  ) as IActionBlock) ?? {
    url: '',
    text: '',
  };

  const showBody = () => Boolean(renderBody.text);
  const showButton = () =>
    Boolean(actionButtonText) && Boolean(actionButtonUrl);

  return (
    <View
      style={{ ...styles.overAll, ...(isFirst && styles.firstMessageMargin) }}
    >
      <View style={styles.messageContainer}>
        <SvgDot size={8} color={primary} style={styles.dotStyle} show={!read} />
        <View style={styles.notificationBodyContainer}>
          <Text style={styles.headerTextStyle}>{title}</Text>
          {showBody() && (
            <Text style={styles.subHeaderStyle}>{renderBody.text}</Text>
          )}
          {showButton() && (
            <View style={styles.flexRow}>
              <View style={styles.actionButtonContainerStyle}>
                <OpenButtonUrl
                  title={actionButtonText}
                  url={actionButtonUrl}
                  onSuccess={onActionSuccess}
                />
              </View>
            </View>
          )}
        </View>
      </View>
      <View style={styles.fromNowContainer}>
        <Text style={styles.fromNowText}>{getFormattedDate()}</Text>
        <BurgerIcon
          onPress={() => {
            onPress(message);
          }}
        />
      </View>
    </View>
  );
}

export default Message;

Message.defaultProps = {
  isFirst: false,
};
