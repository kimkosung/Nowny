import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  ActivityIndicator,
} from 'react-native';
import {useAuth} from '../contexts/AuthContext';
import {SafeAreaView} from 'react-native-safe-area-context';
import AlertModal from '../components/AlertModal';
import {useCustomNavigation} from '../hooks/useCustomNavigation';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [hint, setHint] = useState(false);
  const [modalType, setModalType] = useState('warning');

  const {login} = useAuth();
  const nav = useCustomNavigation();

  const handleLogin = async () => {
    if (!email || !password) {
      setError('이메일과 비밀번호를 모두 입력해주세요.');
      setModalType('warning');
      setModalVisible(true);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const success = await login(email, password);
      if (!success) {
        setError('이메일 또는 비밀번호가 올바르지 않습니다.');
        setHint(true);
        setModalType('error');
        setModalVisible(true);
      }
    } catch (err) {
      setError('로그인 중 오류가 발생했습니다.');
      setModalType('error');
      setModalVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = () => {
    nav.navigateTo('Auth/Register');
  };

  const handleFindPassword = () => {
    nav.navigateTo('Auth/FindPassword');
  };

  const closeModal = () => {
    setModalVisible(false);
    setHint(false);
  };

  const handleSocialLogin = (provider: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setError(`${provider} 로그인은 현재 개발 중입니다.`);
      setModalType('info');
      setModalVisible(true);
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
            <View style={styles.headerContainer}>
              <Text
                style={{
                  fontFamily: 'Raleway-SemiBold',
                  fontSize: 48,
                  color: '#FFA135',
                  textAlign: 'center',
                }}>
                NOWNY
              </Text>
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="이메일을 입력해주세요"
                  placeholderTextColor="#D18245"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!isLoading}
                />
              </View>

              <View style={styles.inputWrapper}>
                <TextInput
                  secureTextEntry={true}
                  style={styles.input}
                  placeholder="비밀번호를 입력해주세요"
                  placeholderTextColor="#D18245"
                  value={password}
                  onChangeText={setPassword}
                  editable={!isLoading}
                />
              </View>

              <View style={styles.forgotPasswordContainer}>
                <TouchableOpacity
                  onPress={handleFindPassword}
                  disabled={isLoading}>
                  <Text style={styles.forgotPasswordText}>
                    비밀번호를 잊으셨나요?
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[
                  styles.loginButton,
                  isLoading && styles.loginButtonDisabled,
                ]}
                onPress={handleLogin}
                disabled={isLoading}>
                {isLoading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.buttonText}>로그인</Text>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>간편 로그인</Text>
              <View style={styles.divider} />
            </View>

            {/* 소셜 로그인 버튼 */}
            <View style={styles.socialLoginContainer}>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => handleSocialLogin('카카오톡')}
                disabled={isLoading}>
                <Image
                  source={require('../../public/images/kakao_icon.png')}
                  style={[styles.socialIcon, isLoading && styles.disabledIcon]}
                  resizeMode="contain"
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => handleSocialLogin('네이버')}
                disabled={isLoading}>
                <Image
                  source={require('../../public/images/naver_icon.png')}
                  style={[styles.socialIcon, isLoading && styles.disabledIcon]}
                  resizeMode="contain"
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => handleSocialLogin('구글')}
                disabled={isLoading}>
                <Image
                  source={require('../../public/images/google_icon.png')}
                  style={[styles.socialIcon, isLoading && styles.disabledIcon]}
                  resizeMode="contain"
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => handleSocialLogin('애플')}
                disabled={isLoading}>
                <Image
                  source={require('../../public/images/apple_icon.png')}
                  style={[styles.socialIcon, isLoading && styles.disabledIcon]}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>계정이 없으신가요?</Text>
              <TouchableOpacity
                style={styles.signupButton}
                onPress={handleRegister}
                disabled={isLoading}>
                <Text
                  style={[
                    styles.signupButtonText,
                    isLoading && styles.disabledText,
                  ]}>
                  회원가입
                </Text>
              </TouchableOpacity>
            </View>

            <AlertModal
              visible={modalVisible}
              title="알림"
              message={error}
              hintMessage={
                hint
                  ? "힌트: 아이디는 'test', 비밀번호는 '1234'입니다."
                  : undefined
              }
              onClose={closeModal}
            />
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#222222',
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 16,
    color: '#666666',
  },
  inputContainer: {
    width: '100%',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
    marginLeft: 4,
  },
  inputWrapper: {
    marginBottom: 16,
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
  eyeIconContainer: {
    position: 'absolute',
    right: 20,
    top: 16,
  },
  eyeIcon: {
    fontSize: 20,
    color: '#D18245',
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginTop: 4,
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#FF8C00',
    fontWeight: '500',
  },
  loginButton: {
    marginTop: 24,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#FFA135',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonDisabled: {
    backgroundColor: '#FFBB6A',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#FFD3A9',
  },
  dividerText: {
    paddingHorizontal: 16,
    color: '#D18245',
    fontSize: 14,
  },
  socialLoginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginBottom: 48,
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialIcon: {
    width: 56,
    height: 56,
  },
  disabledIcon: {
    opacity: 0.5,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    fontSize: 14,
    color: '#666666',
    marginRight: 8,
  },
  signupButton: {
    backgroundColor: 'transparent',
  },
  signupButtonText: {
    color: '#FFA135',
    fontWeight: '700',
    fontSize: 14,
  },
  disabledText: {
    color: '#FFBB6A',
  },
});

export default Login;
