import video, { Ivideo } from "../models/video.model";

const savevideo = async (payload: Ivideo) => {
  const response = await video.create([payload]);
  return response[0];
};

const saveMultiplevideos = async (payload: Ivideo[]) => {
  return await video.insertMany(payload);
};

const getvideoById = async (id: string) => {
  return await video.findById(id);
};

const updatevideoMessageById = async (id: string, message: string) => {
  return await video.findOneAndUpdate({ _id: id }, { message }, { new: true });
};

const deletevideobyId = async (id: string) => {
  return await video.deleteOne({ _id: id });
};

const getUservideos = async (user: string) => {
  return await video.find({ user }).sort({ createdAt: -1 });
};


export {
  savevideo,
  saveMultiplevideos,
  getvideoById,
  updatevideoMessageById,
  deletevideobyId,
  getUservideos,
};
