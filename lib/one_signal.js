var OneSignal = require("onesignal-node");

var one_signal_client = new OneSignal.Client({
  userAuthKey: process.env.ONE_SIGNAL_USER_ID,
  app: {
    appId: process.env.ONE_SIGNAL_APP_ID,
    appAuthKey: process.env.ONS_SIGNAL_APP_KEY
  }
});
var notification = new OneSignal.Notification({});

module.exports = {
  notification_to: function(message, to) {
    notification.postBody["contents"] = message;
    notification.postBody["include_player_ids"] = to;

    return one_signal_client.sendNotification(notification);
  },
  global_notification: function(message, time = null) {
    notification.postBody["contents"] = message;
    notification.postBody["included_segments"] = [
      "Active Users",
      "Inactive Users"
    ];
    if (time) {
      notification.postBody["send_after"] = time;
    }

    return one_signal_client.sendNotification(notification);
  },
  cancel_notification: function(one_signal_id) {
    return one_signal_client.cancelNotification(one_signal_id);
  }
};
