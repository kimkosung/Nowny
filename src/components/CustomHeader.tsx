import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface CustomHeaderProps {
  title?: string;
  showBackButton?: boolean;
  rightButton?: {
    title?: string;
    icon?: React.ReactNode;
    onPress: () => void;
  };
  containerStyle?: ViewStyle;
  titleStyle?: TextStyle;
  backButtonStyle?: ViewStyle;
  rightButtonStyle?: ViewStyle;
  onBackPress?: () => void;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({
  title,
  showBackButton = true,
  rightButton,
  containerStyle,
  titleStyle,
  backButtonStyle,
  rightButtonStyle,
  onBackPress,
}) => {
  const navigation = useNavigation();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={[styles.headerContainer, containerStyle]}>
      <View style={styles.leftSection}>
        {showBackButton && (
          <TouchableOpacity
            style={[styles.backButton, backButtonStyle]}
            onPress={handleBackPress}>
            <Ionicons name={'chevron-back-outline'} size={20} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.centerSection}>
        {title && <Text style={[styles.titleText, titleStyle]}>{title}</Text>}
      </View>

      <View style={styles.rightSection}>
        {rightButton && (
          <TouchableOpacity
            style={[styles.rightButton, rightButtonStyle]}
            onPress={rightButton.onPress}>
            {rightButton.icon ? (
              rightButton.icon
            ) : rightButton.title ? (
              <Text style={styles.rightButtonText}>{rightButton.title}</Text>
            ) : null}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    height: 56,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    paddingHorizontal: 16,
  },
  leftSection: {
    flex: 1,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 2,
    alignItems: 'center',
  },
  rightSection: {
    flex: 1,
    alignItems: 'flex-end',
  },
  backButton: {
    padding: 4,
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  titleText: {
    fontSize: 16,
    fontWeight: '600',
  },
  rightButton: {
    padding: 8,
  },
  rightButtonText: {
    fontSize: 14,
    color: '#007AFF',
  },
});

export default CustomHeader;
