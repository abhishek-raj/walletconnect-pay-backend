const express = require("express"); //eslint-disable-line
const router = require("express-promise-router")();
const passport = require("passport");
const passportConfig = require("../passport"); //eslint-disable-line
const { validateBody, schemas } = require("../helpers/joi");
const AdminController = require("../controllers/admin");
const { verifyUserMiddleware } = require("../helpers/jwt");

router
  .route("/waiting-list")
  .get(
    passport.authenticate("jwt", { session: false }),
    verifyUserMiddleware,
    AdminController.waitingList
  );

router
  .route("/signin")
  .post(
    validateBody(schemas.adminAuth),
    passport.authenticate("local", { session: false }),
    AdminController.signIn
  );

router
  .route("/add-user")
  .post(
    validateBody(schemas.adminActions),
    passport.authenticate("jwt", { session: false }),
    verifyUserMiddleware,
    AdminController.addUser
  );

router
  .route("/resend-email")
  .post(
    validateBody(schemas.adminActions),
    passport.authenticate("jwt", { session: false }),
    verifyUserMiddleware,
    AdminController.resendEmail
  );

router
  .route("/remove-user")
  .post(
    validateBody(schemas.adminActions),
    passport.authenticate("jwt", { session: false }),
    verifyUserMiddleware,
    AdminController.removeUser
  );

module.exports = router;
