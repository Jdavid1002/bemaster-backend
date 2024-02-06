import { Document, model, Schema, Types } from "mongoose";

export interface Ivideo {
  message: string;
  user: any;
  parentvideo?: any;
  isThread: boolean;
  isParent: boolean;
  videoIndex?: number;
}

const videoSchema = new Schema<Ivideo>(
  {
    message: { type: String, required: true },
    user: { type: Types.ObjectId, ref: "User", required: true },
    parentvideo: { type: Types.ObjectId, ref: "video", default: null },
    isThread: { type: Boolean, required: true, default: false },
    isParent: { type: Boolean, required: true, default: true },
    videoIndex: { type: Number, required: false, default: 0 },
  },
  { timestamps: true }
);

const video = model<Ivideo>("video", videoSchema);

export default video;
