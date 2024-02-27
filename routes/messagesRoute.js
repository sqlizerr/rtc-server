const { addMessage, getAllMessages, getSavedChats } = require("../controllers/messagesController");
const router = require("express").Router();

router.post("/addmsg", addMessage);
router.post("/getmsg", getAllMessages);
router.post("/savedchats", getSavedChats);

module.exports = router;