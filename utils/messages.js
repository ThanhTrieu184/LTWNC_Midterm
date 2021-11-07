const moment = require("moment");
const formatMessage = (user_id, username, text, time) => {
  return {
    user_id,
    username,
    text,
    time:
      time.split(":")[0] == moment().format("DD/MM/YYYY")
        ? time.split(":")[1] + ":" + time.split(":")[2]
        : time.split(":")[0] +
          " " +
          time.split(":")[1] +
          ":" +
          time.split(":")[2],
  };
};

module.exports = formatMessage;
