import express from "express";
import {
  createvideo,
  deletevideo,
  getUserFeed,
  getUservideo,
  updatevideo,
} from "../../controllers/video.controller";
import auth from "../../middlewares/auth";
import validate from "../../middlewares/validate";
import * as videoValidations from "../../validations/video.validation";
const videoRoute = express.Router();

videoRoute.get("/feed", auth("video"), getUserFeed);

videoRoute.get("/", auth("video"), getUservideo);

videoRoute.post(
  "/create",
  [auth("video"), validate(videoValidations.createvideo)],
  createvideo
);

videoRoute.delete("/:id", auth("video"), deletevideo);

videoRoute.patch(
  "/:id",
  [auth("video"), validate(videoValidations.videoUpdate)],
  updatevideo
);

export default videoRoute;
