const router = require("express").Router();

const {
  register,
  login,
  profileUpdate,
} = require("../controllers/auth.controller");
const { auth } = require("../middleware/auth.middleware");

router.post("/register", register);

router.post("/login", login);

router.put("/me", auth, profileUpdate);

module.exports = router;
