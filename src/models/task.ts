import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
	name: { type: String, required: true, trim: true },
	state: { type: Boolean, default: false },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
	projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
}, { timestamps: true });

export type TaskType = mongoose.InferSchemaType<typeof taskSchema>;

export const TaskModel = mongoose.model<TaskType>('Task', taskSchema);