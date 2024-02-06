import * as Joi from "joi";

const video = Joi.object({
  message: Joi.string().required(),
  id: Joi.number().integer().min(0).required(),
});

const videoUpdate = {
  body: Joi.object().keys({
    message: Joi.string().required(),
  }),
};

const likevideo = {
  body: Joi.object().keys({
    like: Joi.boolean().required(),
  }),
};

const createvideo = {
  body: Joi.array().items(video).min(1).required(),
};

export { createvideo, video, videoUpdate, likevideo };
