const db = require("../config/db");

function logActivity(user_id, activity) {

    db.query(

        "INSERT INTO activities(user_id, activity) VALUES(?, ?)",

        [user_id, activity],

        (err) => {

            if (err) {

                console.log("Activity Error:", err);

            }

        }

    );

}

module.exports = logActivity;