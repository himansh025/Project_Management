import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  tasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Create indexes for efficient querying
projectSchema.index({ createdBy: 1 });
projectSchema.index({ createdAt: -1 });

// Virtual for task count
projectSchema.virtual('taskCount').get(function() {
  return this.tasks ? this.tasks.length : 0;
});

// Methods
projectSchema.methods.addUser = function(userId) {
  if (!this.users.includes(userId)) {
    this.users.push(userId);
  }
  return this.save();
};

projectSchema.methods.removeUser = function(userId) {
  this.users = this.users.filter(user => user.toString() !== userId.toString());
  return this.save();
};

projectSchema.methods.addTask = function(taskId) {
  if (!this.tasks.includes(taskId)) {
    this.tasks.push(taskId);
  }
  return this.save();
};

projectSchema.methods.removeTask = function(taskId) {
  this.tasks = this.tasks.filter(task => task.toString() !== taskId.toString());
  return this.save();
};

// Configure toJSON
projectSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret.__v;
    return ret;
  }
});

const Project = mongoose.model('Project', projectSchema);

export default Project;