import { Platform, Alert } from "react-native";

function getWebToast() {
  if (Platform.OS !== "web") return null;
  try {
    // Lazy require to avoid bundling on native platforms
    // eslint-disable-next-line global-require
    const mod = require("react-hot-toast");
    return mod?.toast || null;
  } catch (e) {
    return null;
  }
}

export function toastSuccess(message) {
  const webToast = getWebToast();
  if (webToast) return webToast.success(message);
  return Alert.alert("Success", message);
}

export function toastError(message) {
  const webToast = getWebToast();
  if (webToast) return webToast.error(message);
  return Alert.alert("Error", message);
}

export function toastInfo(message) {
  const webToast = getWebToast();
  if (webToast) return webToast(message);
  return Alert.alert("Info", message);
}

export function toastLoading(message) {
  const webToast = getWebToast();
  if (webToast) return webToast.loading(message);
  // No loading toast on native fallback; return noop id
  return null;
}

export function toastDismiss(id) {
  const webToast = getWebToast();
  if (webToast && id) webToast.dismiss(id);
}

export async function toastWrap(promise, { loading = "Loading...", success = "Done", error = "Failed" } = {}) {
  const webToast = getWebToast();
  if (webToast) {
    // eslint-disable-next-line global-require
    const { toast } = require("react-hot-toast");
    return toast.promise(promise, { loading, success, error });
  }
  try {
    Alert.alert("Please wait", loading);
    const result = await promise;
    Alert.alert("Success", success);
    return result;
  } catch (e) {
    Alert.alert("Error", typeof error === "string" ? error : error?.message || "Failed");
    throw e;
  }
}


