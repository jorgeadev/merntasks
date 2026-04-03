import mongoose, { type InferSchemaType } from "mongoose";

const projectSchema = new mongoose.Schema(
	{
		name: { type: String, required: true, trim: true },
		createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
		createdAt: { type: Date, default: Date.now },
		updatedAt: { type: Date, default: Date.now },
	},
	{ timestamps: true },
);

export type ProjectType = InferSchemaType<typeof projectSchema>;

export const ProjectModel = mongoose.model<ProjectType>(
	"Project",
	projectSchema,
);
