import { NextFunction, Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { NotFoundError } from "../errors";
import Task from "../models/Task";
import { checkPermission } from "../utils/checkPermission";

//create To-Do Task with title,description and status(optional) in req.body for authenticated user
const createTask = asyncHandler(async (req: Request, res: Response) => {

    const { title, description, status } = req.body;
    if (!title && !description) {
        throw new NotFoundError('title or description missing');
    }
    const object = {
        ...req.body,
        user: req.user?._id
    }

    const task = await Task.create(object)

    res.status(200).json({ task })

})

//get All To-Do Tasks
const getAllTask = asyncHandler(async (req: Request, res: Response) => {

    const tasks = await Task.find({})

    res.status(200).json({ tasks })

})

//get current authenticated user to-do tasks
const getCurrentUserTask = asyncHandler(async (req: Request, res: Response) => {
    const result = await Task.find({ user: req.user._id })
    res.status(200).json({ task: result })
})


//get Single To-do Task of authenticated user
const getSingleTask = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id: taskId } = req.params;
    const task = await Task.findById(taskId)
    if (!task) {
        throw new NotFoundError(`No task found with ${taskId}`)
    }
    // check if the logged-in user is authorized to view the resource
    checkPermission(req.user._id, task.user)
    res.status(200).json({ task })
})


//update status for to-do list task for authenticated user
const updateTask = asyncHandler(async (req: Request, res: Response) => {
    const { id: taskId } = req.params
    const { status } = req.body
    const task = await Task.findById({ _id: taskId })
    if (!task) {
        throw new NotFoundError(`No task with ${taskId}`)
    }
    // check if the logged in user is authorized to update the resource
    checkPermission(req.user._id, task.user)
    task.status = status;
    await task.save({ validateBeforeSave: true })
    res.status(200).json({ task })


})

//deletes a task only authorized user can delete the task
const deleteTask = asyncHandler(async (req: Request, res: Response) => {
    const { id: taskId } = req.params;
    const task = await Task.findOne({ _id: taskId })
    if (!task) {
        throw new NotFoundError(`No task with ${taskId}`)
    }
    checkPermission(req.user._id, task.user)
    await task.deleteOne();
    res.status(200).json({ msg: "Task Removed successfully" })


})

export { createTask, getAllTask, getCurrentUserTask, getSingleTask, updateTask, deleteTask }