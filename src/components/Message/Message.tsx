import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict';
import type { MessageType } from 'src/hooks/useMessage/MessagesStore/Messagestypes';
import { SvgDot } from '../SvgDot';
import { SEMI_BOLD } from '../../constants/fontSize';
import { GRAY } from '../../constants/colors';
import { BurgerIcon } from '../BurgerIcon';
import { useBrand } from '../../context/CourierProvider';

const styles = StyleSheet.create({
  overAll: {
    backgroundColor: '#F9FAFB',
    borderRadius: 4,
    marginBottom: 6,
    paddingVertical: 16,
    paddingRight: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  headerTextStyle: {
    fontWeight: SEMI_BOLD,
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
    marginRight: 8,
  },
});

type Prop = {
  onPress: (_msg: MessageType) => void;
  message: MessageType;
};

function Message({ onPress, message }: Prop) {
  const {
    content: { title, body },
    read,
    created: createdAt,
  } = message;
  const {
    colors: { primary },
  } = useBrand();
  const getFormattedDate = () =>
    formatDistanceToNowStrict(new Date(createdAt), {
      addSuffix: true,
    });

  return (
    <View style={styles.overAll}>
      <View style={styles.messageContainer}>
        <SvgDot size={8} color={primary} style={styles.dotStyle} show={!read} />
        <View>
          <Text style={styles.headerTextStyle}>{title}</Text>
          <Text style={styles.subHeaderStyle}>{body}</Text>
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
