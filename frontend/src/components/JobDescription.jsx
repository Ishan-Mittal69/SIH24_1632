import React, { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useParams } from "react-router-dom";
import axios from "axios";
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from "@/utils/constant";
import { setSingleJob } from "@/redux/jobSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const JobDescription = () => {
  const { singleJob } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);
  const isIntiallyApplied =
    singleJob?.applications?.some(
      (application) => application.applicant === user?._id
    ) || false;
  const [isApplied, setIsApplied] = useState(isIntiallyApplied);

  const params = useParams();
  const jobId = params.id;
  const dispatch = useDispatch();

  const applyJobHandler = async () => {
    try {
      const res = await axios.get(
        `${APPLICATION_API_END_POINT}/apply/${jobId}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        setIsApplied(true); // Update the local state
        const updatedSingleJob = {
          ...singleJob,
          applications: [...singleJob.applications, { applicant: user?._id }],
        };
        dispatch(setSingleJob(updatedSingleJob)); // helps us to real time UI update
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    const fetchSingleJob = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setSingleJob(res.data.job));
          setIsApplied(
            res.data.job.applications.some(
              (application) => application.applicant === user?._id
            )
          ); // Ensure the state is in sync with fetched data
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchSingleJob();
  }, [jobId, dispatch, user?._id]);

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h1 className="font-bold text-xl dark:text-white">{singleJob?.title}</h1>
      <div className="flex items-center gap-2 mt-4">
        <Badge
          className="text-blue-700 dark:text-blue-300 font-bold"
          variant="ghost"
        >
          {singleJob?.position} Positions
        </Badge>
        <Badge
          className="text-[#F83002] dark:text-red-400 font-bold"
          variant="ghost"
        >
          {singleJob?.jobType}
        </Badge>
        <Badge
          className="text-[#7209b7] dark:text-purple-400 font-bold"
          variant="ghost"
        >
          {singleJob?.salary}LPA
        </Badge>
      </div>
      <Button
        onClick={isApplied ? null : applyJobHandler}
        disabled={isApplied}
        className={`rounded-lg ${
          isApplied
            ? "bg-gray-600 dark:bg-gray-700 cursor-not-allowed"
            : "bg-[#7209b7] dark:bg-purple-600 hover:bg-[#5f32ad] dark:hover:bg-purple-500"
        }`}
      >
        {isApplied ? "Already Applied" : "Apply Now"}
      </Button>
      <h1 className="border-b-2 border-b-gray-300 dark:border-b-gray-600 font-medium py-4 dark:text-white">
        Job Description
      </h1>
      <div className="my-4">
        <h1 className="font-bold my-1 dark:text-white">
          Role:{" "}
          <span className="pl-4 font-normal text-gray-800 dark:text-gray-300">
            {singleJob?.title}
          </span>
        </h1>
        <h1 className="font-bold my-1 dark:text-white">
          Location:{" "}
          <span className="pl-4 font-normal text-gray-800 dark:text-gray-300">
            {singleJob?.location}
          </span>
        </h1>
        <h1 className="font-bold my-1 dark:text-white">
          Description:{" "}
          <span className="pl-4 font-normal text-gray-800 dark:text-gray-300">
            {singleJob?.description}
          </span>
        </h1>
        <h1 className="font-bold my-1 dark:text-white">
          Experience:{" "}
          <span className="pl-4 font-normal text-gray-800 dark:text-gray-300">
            {singleJob?.experience} yrs
          </span>
        </h1>
        <h1 className="font-bold my-1 dark:text-white">
          Salary:{" "}
          <span className="pl-4 font-normal text-gray-800 dark:text-gray-300">
            {singleJob?.salary}LPA
          </span>
        </h1>
        <h1 className="font-bold my-1 dark:text-white">
          Total Applicants:{" "}
          <span className="pl-4 font-normal text-gray-800 dark:text-gray-300">
            {singleJob?.applications?.length}
          </span>
        </h1>
        <h1 className="font-bold my-1 dark:text-white">
          Posted Date:{" "}
          <span className="pl-4 font-normal text-gray-800 dark:text-gray-300">
              {singleJob?.createdAt ? singleJob.createdAt.split("T")[0] : "Not available"}
          </span>
        </h1>
      </div>
    </div>
  );
};

export default JobDescription;
