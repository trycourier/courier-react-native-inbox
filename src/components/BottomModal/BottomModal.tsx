import { View, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { OVERLAY_COLOR } from '../../constants/colors';

type PropType = {
  open: boolean;
  onClose: () => void;
  isDismissable?: boolean;
  children: JSX.Element | JSX.Element[];
};

const styles = StyleSheet.create({
  modalRootContainer: {
    justifyContent: 'flex-end',
    flexGrow: 1,
    backgroundColor: OVERLAY_COLOR,
  },
  outerContainer: {
    height: '100%',
  },
});

function BottomModal({
  open,
  onClose,
  isDismissable = true,
  children,
}: PropType) {
  return (
    <Modal
      visible={open}
      transparent
      onRequestClose={onClose}
      animationType="none"
    >
      <TouchableOpacity
        style={styles.outerContainer}
        activeOpacity={1}
        onPress={() => {
          if (isDismissable) onClose();
        }}
      >
        <View style={styles.modalRootContainer}>
          <TouchableOpacity activeOpacity={1}>{children}</TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

BottomModal.defaultProps = {
  isDismissable: true,
};

export default BottomModal;
