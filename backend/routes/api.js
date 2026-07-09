import express from "express";
import {getQuota} from "../store/dataStore.js";
import {requireAuth} from "../middleware/auth.js";

const router = express.Router();

router.get("/quota", requireAuth, (req, res) => {
    res.json(getQuota());
});

export default router;
