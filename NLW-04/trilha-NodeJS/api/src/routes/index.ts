import express, { request, Router } from "express";

const router = Router();

router.post("/", (request, response) => response.json({ ok: true }))

export default router;