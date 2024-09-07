import { Job } from "../models/job.model.js";

export const postJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experience,
      position,
      companyId,
      jobId,
    } = req.body;
    const userId = req.id;

    if (
      !title ||
      !description ||
      !requirements ||
      !salary ||
      !location ||
      !jobType ||
      !experience ||
      !position ||
      !companyId ||
      !jobId
    ) {
      return res.status(400).json({
        message: "Something is missing.",
        success: false,
      });
    }
    const job = await Job.create({
      title,
      description,
      requirements: requirements.split(","),
      salary: Number(salary),
      location,
      jobType,
      experienceLevel: experience,
      position,
      company: companyId,
      created_by: userId,
      jobId: jobId,
    });
    return res.status(201).json({
      message: "New job created successfully.",
      job,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
// student k liye
// export const getAllJobs = async (req, res) => {
//   try {
//     const keyword = req.query.keyword || "";
//     const query = {
//       $or: [
//         { title: { $regex: keyword, $options: "i" } },
//         { description: { $regex: keyword, $options: "i" } },
//       ],
//     };
//     const jobs = await Job.find(query)
//       .populate({
//         path: "company",
//       })
//       .sort({ createdAt: -1 });
//     if (!jobs) {
//       return res.status(404).json({
//         message: "Jobs not found.",
//         success: false,
//       });
//     }
//     return res.status(200).json({
//       jobs,
//       success: true,
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };

import axios from "axios";
import { User } from "../models/user.model.js";

export const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    let jobs;

    if (keyword == "my") {
      // Extract skills and location from user model
      const userId = req.id;
      console.log("user id is", userId);
      const user = await User.findById(userId);
      const skills = user.profile.skills;
      const location = user.location;
      console.log(skills);
      console.log(location);
      console.log(location);
      try {
        const response = await axios.post(
          "https://recommendation-system-f6se.onrender.com/api",
          {
            skills,
            location,
          }
        );
        // console.log(response);
        const jobIds = response.data.indices;
        console.log("After fetching jobIds");
        console.log(jobIds);

        // Fetch jobs using the jobIds
        jobs = await Job.find({ jobId: { $in: jobIds } }).populate({
          path: "company",
        });

        console.log(jobs);
      } catch (err) {
        console.log(err);
        return res.status(404).json({
          message: "Jobs not found.",
          success: false,
        });
      }
    } else {
      // Construct query for keyword search
      const query = {
        $or: [
          { title: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      };

      // Fetch jobs based on the keyword query
      jobs = await Job.find(query)
        .populate({
          path: "company",
        })
        .sort({ createdAt: -1 });
    }

    if (!jobs || jobs.length === 0) {
      return res.status(404).json({
        message: "Jobs not found.",
        success: false,
      });
    }

    return res.status(200).json({
      jobs,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error.",
      success: false,
    });
  }
};

// student
export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId).populate({
      path: "applications",
    });
    if (!job) {
      return res.status(404).json({
        message: "Jobs not found.",
        success: false,
      });
    }
    return res.status(200).json({ job, success: true });
  } catch (error) {
    console.log(error);
  }
};
// admin kitne job create kra hai abhi tk
export const getAdminJobs = async (req, res) => {
  try {
    const adminId = req.id;
    const jobs = await Job.find({ created_by: adminId }).populate({
      path: "company",
      createdAt: -1,
    });
    if (!jobs) {
      return res.status(404).json({
        message: "Jobs not found.",
        success: false,
      });
    }
    return res.status(200).json({
      jobs,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
