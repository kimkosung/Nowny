import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import CustomHeader from '../components/CustomHeader';

export default function FindPassword() {
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGetVerificationCode = () => {
    if (!email || !phoneNumber) {
      // 여기에 유효성 검사 및 알림 로직 추가
      return;
    }

    setIsLoading(true);

    // 실제 구현에서는 여기에 인증번호 발송 API 호출
    setTimeout(() => {
      setIsLoading(false);
      // 성공 시 다음 단계로 이동하는 로직
      // 예: navigation.navigate('VerifyCode', { email, phoneNumber });
    }, 1500);
  };

  const formatPhoneNumber = (text: string) => {
    // 숫자만 추출
    const cleaned = text.replace(/[^\d]/g, '');

    // 전화번호 형식에 맞게 포맷팅 (010-1234-5678)
    if (cleaned.length <= 3) {
      return cleaned;
    } else if (cleaned.length <= 7) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
    } else {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(
        7,
        11,
      )}`;
    }
  };

  const handlePhoneNumberChange = (text: string) => {
    setPhoneNumber(formatPhoneNumber(text));
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <CustomHeader title="비밀번호 찾기" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.content}>
            <View style={styles.formContainer}>
              <Text style={styles.infoText}>
                가입 시 등록한 이메일과 전화번호를 입력하시면{'\n'}
                비밀번호 재설정을 위한 인증번호를 보내드립니다.
              </Text>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>이메일</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="가입하신 이메일을 입력해주세요"
                    placeholderTextColor="#D18245"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    editable={!isLoading}
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>전화번호</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="전화번호를 입력해주세요"
                    placeholderTextColor="#D18245"
                    value={phoneNumber}
                    onChangeText={handlePhoneNumberChange}
                    keyboardType="number-pad"
                    editable={!isLoading}
                    maxLength={13} // 010-1234-5678 형식 맞춤
                  />
                </View>
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[
                  styles.verifyButton,
                  isLoading && styles.buttonDisabled,
                ]}
                onPress={handleGetVerificationCode}
                disabled={isLoading}>
                {isLoading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.buttonText}>인증번호 받기</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  formContainer: {
    flex: 1,
    paddingTop: 24,
  },
  infoText: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 32,
    lineHeight: 24,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
    marginLeft: 4,
  },
  inputWrapper: {
    marginBottom: 8,
    position: 'relative',
  },
  input: {
    height: 60,
    backgroundColor: '#FFF5EB',
    borderWidth: 1,
    borderColor: '#FFD3A9',
    borderRadius: 12,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#824B20',
  },
  buttonContainer: {
    marginTop: 'auto',
    paddingBottom: 24,
  },
  verifyButton: {
    height: 56,
    borderRadius: 12,
    backgroundColor: '#FFA135',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#FFBB6A',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
});
