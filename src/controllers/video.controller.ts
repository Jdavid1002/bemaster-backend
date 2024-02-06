import * as httpStatus from "http-status";
import video from "../models/video.model";
import { IUser } from "../models/user.model";
import {
  deletevideobyId,
  getvideoById,
  getUservideos,
  saveMultiplevideos,
  savevideo,
  updatevideoMessageById,
} from "../services/video.service";
import catchAsync from "../utils/catchAsync";

const createvideo = catchAsync(async (req, res) => {
  const {
    user,
    body,
  }: { user: IUser; body: { message: string; id: number }[] } = req;

  const sortedvideos = body.sort((a, b) => a.id - b.id);

  const IS_THREAD = body.length > 1;

  const savePayload = {
    message: sortedvideos[0].message,
    user: user._id,
    isThread: IS_THREAD,
    isParent: IS_THREAD ? true : false,
  };
  const parentvideo = await savevideo(savePayload);

  if (IS_THREAD) {
    const threads = sortedvideos.splice(0, 1).map((video, index) => {
      return {
        message: video.message,
        user: user._id,
        isThread: true,
        isParent: false,
        videoIndex: index + 1,
        parentvideo: parentvideo._id,
      };
    });

    await saveMultiplevideos(threads);
  }

  res.status(httpStatus.OK).send({ message: "video created successfully" });
});

const getvideo = catchAsync(async (req, res) => {
  res.status(httpStatus.OK).send({ message: "success" });
});

const getUservideo = catchAsync(async (req, res) => {
  const user = req.user;
  const videos = await getUservideos(user._id);
  res.status(httpStatus.OK).send({ message: "success", videos });
});

const deletevideo = catchAsync(async (req, res) => {
  const videoId = req.params.id;

  const user = req.user;

  if (!videoId) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .send({ message: "video id is required" });
  }

  const video = await getvideoById(videoId);

  if (!video) {
    return res
      .status(httpStatus.NOT_FOUND)
      .send({ message: "video not found" });
  } else {
    if (video.user.toString() !== user._id.toString()) {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .send({ message: "Unauthorized" });
    } else {
      await deletevideobyId(videoId);
      return res
        .status(httpStatus.OK)
        .send({ message: "video deleted successfully" });
    }
  }
});

const updatevideo = catchAsync(async (req, res) => {
  const videoId = req.params.id;

  const { message } = req.body;

  const user = req.user;

  if (!videoId) {
    res
      .status(httpStatus.BAD_REQUEST)
      .send({ message: "video id is required" });
  }

  const video = await getvideoById(videoId);

  if (!video) {
    res.status(httpStatus.NOT_FOUND).send({ message: "video not found" });
  } else {
    if (video.user.toString() !== user._id.toString()) {
      res.status(httpStatus.UNAUTHORIZED).send({ message: "Unauthorized" });
    } else {
      await updatevideoMessageById(videoId, message);
      res.status(httpStatus.OK).send({ message: "video updated successfully" });
    }
  }
});


const getUserFeed = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const currentUser = req.user._id;

  const videos = await video.aggregate([
    {
      $match: {
        user: { $ne: currentUser },
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "video",
        as: "likes",
      },
    },
    {
      $lookup: {
        from: "likes",
        let: { videoId: "$_id", userId: currentUser },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$video", "$$videoId"] },
                  { $eq: ["$user", "$$userId"] },
                ],
              },
            },
          },
          {
            $project: {
              _id: 0,
            },
          },
        ],
        as: "isLikedByCurrentUser",
      },
    },
    {
      $addFields: {
        totalLikes: { $size: "$likes" },
        isLikedByCurrentUser: {
          $cond: {
            if: { $gt: [{ $size: "$isLikedByCurrentUser" }, 0] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        likes: 0,
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
  ]);

  const total = await video.countDocuments({ user: { $ne: currentUser } });

  res.status(httpStatus.OK).send({ data: videos, total, page });
});

export {
  createvideo,
  getvideo,
  deletevideo,
  getUservideo,
  updatevideo,
  getUserFeed,
};
