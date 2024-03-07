import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();
crons.interval(
    "delete old files",
    { minutes:30 }, // every minute
    internal.file.deleteAllFiles,
  );
  export default crons