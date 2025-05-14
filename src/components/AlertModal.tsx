import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
} from 'react-native';

const {width} = Dimensions.get('window');

type AlertType = 'warning' | 'success' | 'error' | 'info';

interface ColorConfig {
  color: string;
}

interface AlertModalProps {
  visible: boolean;
  title?: string;
  message: string;
  buttonText?: string;
  hintMessage?: string;
  onClose: () => void;
  alertType?: AlertType;
}

const AlertModal: React.FC<AlertModalProps> = ({
  visible,
  title = '알림',
  message,
  buttonText = '확인',
  hintMessage,
  onClose,
  alertType = 'warning',
}) => {
  const colorConfig: Record<AlertType, ColorConfig> = {
    warning: {color: '#F5A623'},
    success: {color: '#4CD964'},
    error: {color: '#FF3B30'},
    info: {color: '#4A76FF'},
  };

  const {color} = colorConfig[alertType];

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={[styles.colorIndicator, {backgroundColor: color}]} />
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          {hintMessage && <Text style={styles.hintText}>{hintMessage}</Text>}

          <TouchableOpacity
            style={[styles.button, {backgroundColor: color}]}
            onPress={onClose}>
            <Text style={styles.buttonText}>{buttonText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    width: width * 0.85,
    maxWidth: 320,
  },
  colorIndicator: {
    width: 40,
    height: 4,
    borderRadius: 2,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A2138',
    marginBottom: 8,
  },
  message: {
    marginBottom: 16,
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 22,
    color: '#637394',
  },
  hintText: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 13,
    fontStyle: 'italic',
    lineHeight: 18,
    color: '#637394',
  },
  button: {
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    width: '100%',
    marginTop: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default AlertModal;
