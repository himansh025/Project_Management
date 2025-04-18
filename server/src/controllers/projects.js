import mongoose from 'mongoose';
import Project from '../models/Project.js';
import Task from '../models/Task.js';


export const  createProject= async (req, res) => {
    try {
      const { title, description, users = [] } = req.body;
      
      if (!title || !description) {
        return res.status(400).json({ 
          success: false, 
          message: 'Title and description are required' 
        });
      }
      
      const project = await Project.create({
        title,
        description,
        users,
        tasks: [],
        createdBy: req.user.id
      });
      
      res.status(201).json({
        success: true,
        data: project
      });
    } catch (error) {
      console.error('Error creating project:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Server error', 
        error: error.message 
      });
    }
  }

 
  export const  getAllProjects= async (req, res) => {
    try {
      const projects = await Project.find()
        .populate('createdBy', 'name email')
        .populate('users', 'name email')
        .sort('-createdAt');
      
      res.status(200).json({
        success: true,
        count: projects.length,
        data: projects
      });
    } catch (error) {
      console.error('Error fetching projects:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Server error', 
        error: error.message 
      });
    }
  }

  export const getProjectById= async (req, res) => {
    try {
      const { id } = req.params;
    
      const project = await Project.findById(id).populate('createdBy', 'name email')
      .populate('users', 'name email')
      .populate({
        path: 'tasks',
        populate: [
          {
            path: 'assignedTo',
            model: 'User',
            select: 'name email id'
          },
          {
            path: 'createdBy',
            model: 'User',
            select: 'name email id'
          }
        ]
      });
    
        console.log(project)
      if (!project) {
        return res.status(404).json({ 
          success: false, 
          message: 'Project not found' 
        });
      }
      
      res.status(200).json({
        success: true,
        data: project,
        message:"Successfully get the Project"
      });
    } catch (error) {
      console.error('Error fetching project:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Server error', 
        error: error.message 
      });
    }
  }

 
  export const  updateProject= async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description, users } = req.body;
      
      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid project ID format' 
        });
      }
      
      // Find project
      let project = await Project.findById(id);
      if (!project) {
        return res.status(404).json({ 
          success: false, 
          message: 'Project not found' 
        });
      }
      
      // Check authorization (optional, depends on your requirements)
      // if (project.createdBy.toString() !== req.user.id) {
      //   return res.status(403).json({ message: 'Not authorized to update this project' });
      // }
      
      // Update fields
      const updateData = {};
      if (title) updateData.title = title;
      if (description) updateData.description = description;
      if (users) updateData.users = users;
      
      project = await Project.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      )
        .populate('createdBy', 'name email')
        .populate('users', 'name email');
      
      res.status(200).json({
        success: true,
        message: 'Project updated successfully',
        data: project
      });
    } catch (error) {
      console.error('Error updating project:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Server error', 
        error: error.message 
      });
    }
  }

  
  export const deleteProject = async (req, res) => {
    try {
      const { id } = req.params;
      
      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid project ID format' 
        });
      }
      
      // Find project
      const project = await Project.findById(id);
      if (!project) {
        return res.status(404).json({ 
          success: false, 
          message: 'Project not found' 
        });
      }
      
      // Delete associated tasks
      await Task.deleteMany({ projectId: id });
      
      // Delete project
      await Project.findByIdAndDelete(id);
      
      res.status(200).json({
        success: true,
        message: 'Project and associated tasks deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting project:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Server error', 
        error: error.message 
      });
    }
  }
  
