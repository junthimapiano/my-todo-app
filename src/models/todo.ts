//make todo model mongoose schema

import mongoose, { Schema, model } from 'mongoose';

const todoSchema = new Schema({
    title: String,
    description: String,
    completed: Boolean,
    dueDate: String
});

export default mongoose.models.todos || model('todos', todoSchema);