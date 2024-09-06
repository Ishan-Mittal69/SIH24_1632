import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import { config } from "dotenv";
import express from "express";
import twilio from "twilio";

export const applyJob = async (req, res) => {
  try {
    const userId = req.id;
    const jobId = req.params.id;
    if (!jobId) {
      return res.status(400).json({
        message: "Job id is required.",
        success: false,
      });
    }
    // check if the user has already applied for the job
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: userId,
    });

    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied for this jobs",
        success: false,
      });
    }

    // check if the jobs exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }
    // create a new application
    const newApplication = await Application.create({
      job: jobId,
      applicant: userId,
    });

    job.applications.push(newApplication._id);
    await job.save();
    return res.status(201).json({
      message: "Job applied successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
export const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.id;
    const application = await Application.find({ applicant: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "job",
        options: { sort: { createdAt: -1 } },
        populate: {
          path: "company",
          options: { sort: { createdAt: -1 } },
        },
      });
    if (!application) {
      return res.status(404).json({
        message: "No Applications",
        success: false,
      });
    }
    return res.status(200).json({
      application,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
// admin dekhega kitna user ne apply kiya hai
export const getApplicants = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId).populate({
      path: "applications",
      options: { sort: { createdAt: -1 } },
      populate: {
        path: "applicant",
      },
    });
    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
        success: false,
      });
    }
    return res.status(200).json({
      job,
      succees: true,
    });
  } catch (error) {
    console.log(error);
  }
};
export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.id;
    if (!status) {
      return res.status(400).json({
        message: "status is required",
        success: false,
      });
    }

    // find the application by applicantion id
    const application = await Application.findOne({ _id: applicationId });
    if (!application) {
      return res.status(404).json({
        message: "Application not found.",
        success: false,
      });
    }

    // update the status
    application.status = status.toLowerCase();
    await application.save();

    return res.status(200).json({
      message: "Status updated successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

config();

const app = express();
const MessagingResponse = twilio.twiml.MessagingResponse;

app.use(express.urlencoded({ extended: false }));

export const applyBySms = async (req, res) => {
  console.log("Received message");
  const twiml = new MessagingResponse();
  const receivedMessage = req.body.Body;
  const fromNumber = req.body.From;
  if (!receivedMessage.includes("-")) {
    twiml.message("Invalid format. Please use the correct format.");
    res.writeHead(200, { "Content-Type": "text/xml" });
    res.end(twiml.toString());
  }
  if (!receivedMessage.split("-")[1]) {
    twiml.message("Invalid format. Please use the correct format.");
    res.writeHead(200, { "Content-Type": "text/xml" });
    res.end(twiml.toString());
  }
  const jobId = receivedMessage.split("-")[1];
  const user = await user.findOne({ phoneNumber: fromNumber });
  if (!user) {
    twiml.message("You are not registered. Please register first.");
    res.writeHead(200, { "Content-Type": "text/xml" });
    res.end(twiml.toString());
  }
  const userId = user._id;
  const job = await job.findOne({ jobId: jobId });
  if (!job) {
    twiml.message("Job not found.");
    res.writeHead(200, { "Content-Type": "text/xml" });
    res.end(twiml.toString());
  }
  const jId = job._id;
  const application = await Application.create({
    job: jId,
    applicant: userId,
  });
  job.applications.push(application._id);
  await job.save();
  const companyName = job.findById(job.company).populate("company");
  twiml.message(
    `You have successfully applied for ${job.title} at ${companyName.name}`
  );
  console.log(`Job applied successfully by ${fromNumber}`);
  res.writeHead(200, { "Content-Type": "text/xml" });
  res.end(twiml.toString());
};
