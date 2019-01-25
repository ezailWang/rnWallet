import firebase from "react-native-firebase";
export default class Analytics {
  static enable() {
    firebase.analytics().setAnalyticsCollectionEnabled(true);
  }

  static recordUserId(userId) {
    firebase.analytics().setUserId(userId);
  }

  static setCurrentScreen(screenClass) {
    firebase.analytics().setCurrentScreen(screenClass);
  }

  static recordRequest(method, url) {
    try {
      const urlStr = url.length > 100 ? url.substring(0, 99) : url;
      firebase.analytics().logEvent("request", {
        reqMethod: method,
        reqUrl: urlStr
      });
    } catch (err) {
      firebase.analytics().logEvent("customErr", {
        errName: "recordRequest",
        errDetsail: reqName
      });
    }
  }

  static recordErr(errName, err) {
    if (err === "No transactions found") {
      return;
    }
    try {
      let errStr;
      if (err.message) {
        errStr = err.message;
      } else {
        errStr = JSON.stringify(err);
      }
      console.log(errName, errStr);
      if (errStr.length > 100) {
        errStr = errStr.substring(0, 99);
      }
      firebase.analytics().logEvent("customErr", {
        errName: errName,
        errDetail: errStr
      });
    } catch (err) {
      firebase
        .analytics()
        .logEvent("customErr", { errName: "recordErr", errDetail: errName });
    }
  }

  static recordClick(category, detail) {
    try {
      firebase.analytics().logEvent("click", {
        category: category,
        detail: detail
      });
    } catch (err) {
      firebase
        .analytics()
        .logEvent("customErr", { errName: "recordClick", errDetail: category });
    }
  }
}
