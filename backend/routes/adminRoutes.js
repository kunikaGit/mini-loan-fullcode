const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
require("dotenv").config();
const AdminController = require('../controllers/admin.controllers');

router.use(bodyParser.json());
router.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// Endpoint to get all loan requests
router.get("/getAllLoanRequests", AdminController.getAllLoanRequests);

// Endpoint to approve a loan request
router.post("/approveLoanRequest", AdminController.approveLoanRequest);


router.post("/adminLogin", AdminController.adminLogin);


module.exports.adminRoutes = router;
