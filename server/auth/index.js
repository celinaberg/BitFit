import express from "express";
import cwl from "./cwl";

const router = express.Router();

router.use("/cwl", cwl);

export default router;
