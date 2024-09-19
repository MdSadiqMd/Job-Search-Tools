import { z } from "zod";

const coverLetterInputSchema = z.object({
    jobDescription: z.string().min(1, "Job description cannot be empty"),
    resume: z.string().min(1, "Resume cannot be empty")
});

export default coverLetterInputSchema;