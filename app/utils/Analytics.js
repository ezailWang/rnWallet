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
      if (errStr.length > 50) {
        errStr = errStr.substring(0, 49);
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
