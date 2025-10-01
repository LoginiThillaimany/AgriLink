import { Platform, ToastAndroid, Alert } from 'react-native';

const showToast = (message, type = 'default') => {
  if (Platform.OS === 'android') {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  } else {
    Alert.alert(
      type === 'error' ? 'Error' : 'Success', 
      message
    );
  }
};

export const toastSuccess = (message) => showToast(message, 'success');
export const toastError = (message) => showToast(message, 'error');
export const toastInfo = (message) => showToast(message, 'info');

export const toastWrap = async (promise, messages = {}) => {
  try {
    const result = await promise;
    if (messages.success) toastSuccess(messages.success);
    return result;
  } catch (err) {
    const errorMsg = err.message || messages.error || 'An error occurred';
    toastError(errorMsg);
    throw err;
  }
};