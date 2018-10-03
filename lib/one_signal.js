const OneSignal = require("onesignal-node");

let one_signal_client = new OneSignal.Client({
  userAuthKey: process.env.ONE_SIGNAL_USER_ID,
  app: {
    appId: process.env.ONE_SIGNAL_APP_ID,
    appAuthKey: process.env.ONE_SIGNAL_APP_KEY
  }
});
let notification = new OneSignal.Notification({});

module.exports = {
  notification_to: async function(message, to) {
    notification.postBody["contents"] = message;
    notification.postBody["include_player_ids"] = to;

    return await one_signal_client.sendNotification(notification);
  },
  global_notification: async function(message, time = null) {
    notification.postBody["contents"] = message;
    notification.postBody["included_segments"] = [
      "Active Users",
      "Inactive Users"
    ];
    if (time) {
      notification.postBody["send_after"] = time;
    }

    return await one_signal_client.sendNotification(notification);
  },
  cancel_notification: async function(one_signal_id) {
    return await one_signal_client.cancelNotification(one_signal_id);
  }
};
