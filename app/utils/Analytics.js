import firebase from "react-native-firebase";
export default class Analytics {
  static enable() {
    firebase.analytics().setAnalyticsCollectionEnabled(true);
  }

  static recordUserId(userId) {
    firebase.analytics().setUserId(userId);
  }

  static setCurrentScreen(screenClass){
      firebase.analytics().setCurrentScreen(screenClass)
  }

  static recordErr(errName, err) {
    if (err === "No transactions found") {
      return;
    }
    try {
      console.log(errName, err);
      firebase.analytics().logEvent("err", {
        errName: errName,
        errDetail: JSON.stringify(err)
      });
    } catch (err) {
      firebase
        .analytics()
        .logEvent("err", { errName: "recordErr", errDetail: errName });
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
        .logEvent("err", { errName: "recordClick", errDetail: category });
    }
  }

  static recordAlert(title, content) {
    try {
      firebase.analytics.logEvent("alert", {
        title: title,
        content: content
      });
    } catch (err) {
      firebase
        .analytics()
        .logEvent("err", { errName: "recordAlert", errDetail: title });
    }
  }
}
