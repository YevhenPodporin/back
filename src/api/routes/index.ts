import { Router } from "express";

const router = Router({ mergeParams: true });
import { auth } from "../../middlewares/auth";
import uploadFileMiddleware from "../../middlewares/storageUpload";

import authController from "../controllers/auth.controller";
import networkController from "../controllers/network.controller";
import userController from "../controllers/user.controller";
import chatRouter from "./chatRouter";

router.use(/^\/(?!auth\/).*$/, auth);

/*Authorization roots*/
router.post("/auth/register", uploadFileMiddleware, authController.register);
router.post("/auth/login", authController.login);
router.post("/auth/sign_out", authController.signOut);

router.post("/auth/google", authController.googleAuth);

/*User profile roots*/
router.get("/user/profile", userController.getProfile);
router.post(
  "/user/profile/edit",
  uploadFileMiddleware,
  userController.editProfile,
);

/*Network roots*/
router.get("/network/get_users", networkController.getUsersList);
router.post("/network/request", networkController.userRequest);

router.use("/chat", chatRouter);

// router.get('/image/:file_name', sendFile)
export default router;
