import { Router } from "express";
import authRouter from "./auth.js";
import userRouter from "./userRoutes.js";
import foundItemRouter from "./foundtem.js";
import lostItemRouter from "./lostItem.js";

const routes = Router();

routes.use("/auth", authRouter);
routes.use("/user", userRouter);
routes.use("/founditem", foundItemRouter);
routes.use("/lostitem", lostItemRouter);

export default routes;