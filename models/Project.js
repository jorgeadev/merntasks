const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
	name: { type: String, required: true, trim: true },
	createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },

}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);