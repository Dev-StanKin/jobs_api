const Jobs = require('../models/Job');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');
const Job = require('../models/Job');

const getAllJobs = async (req, res) => {
  const jobs = await Jobs.find({ createdBy: req.user.userId }).sort(
    'createdAt'
  );
  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};
const getJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;
  const job = await Job.findOne({
    _id: jobId,
    createdBy: userId,
  });
  if (!job) {
    throw new NotFoundError(`Job ${jobId} not found`);
  }
  res.status(StatusCodes.OK).json({ job });
};
const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const job = await Jobs.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};
const updateJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
    body: { company, position },
  } = req;

  if (company === '' || position === '') {
    throw new BadRequestError('Please provide company and position');
  }
  const job = await Job.findByIdAndUpdate(
    { _id: jobId, createdBy: userId },
    req.body,
    { new: true, runValidaters: true }
  );
  if (!job) {
    throw new NotFoundError(`Job ${jobId} not found`);
  }
  res.status(StatusCodes.OK).json({ job });
};
const deleteJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;
  const job = await Job.findOneAndDelete({ _id: jobId, createdBy: userId });
  if (!job) {
    throw new NotFoundError(`Job ${jobId} not found`);
  }
  res.status(StatusCodes.OK).send();
};

module.exports = {
  getJob,
  createJob,
  deleteJob,
  updateJob,
  getAllJobs,
};
