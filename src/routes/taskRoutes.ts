import express from 'express'
import { authenticateUser } from '../middlewares/authenticate-user';
import { createTask, getAllTask, getCurrentUserTask, getSingleTask, updateTask, deleteTask } from '../controllers/taskController';

const router = express.Router();

router.route("/").post(authenticateUser, createTask).get(getAllTask)
router.route("/showUserTask").get(authenticateUser, getCurrentUserTask)
router.route("/:id").get(authenticateUser, getSingleTask).patch(authenticateUser, updateTask).delete(authenticateUser, deleteTask)
export default router