import express from "express";
import getMockData from "../services/mockService.ts";

const router = express.Router();

router.get("/", (_req, res) => {
  res.send(getMockData());
});

router.post("/", (_req, res) => {
  res.send("Post to Mock!");
});

export default router;
