import express from "express";

const router = express.Router();

router.use(verifyJWT);
router.route("/request").post();

export default router;

// Request work flow
