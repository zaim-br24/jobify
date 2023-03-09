import { createJob, deleteJob,getAllJobs,updateJob, showStats } from "../Controllers/jobsController.js";
import express from 'express';
const router = express.Router();

router.route('/').post(createJob).get(getAllJobs);
router.route('/stats').get(showStats);
router.route('/:id').delete(deleteJob).patch(updateJob)


export default router;