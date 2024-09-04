import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

import { toast } from '@/hooks/use-toast';

interface GenerateCoverLetterArgs {
    parsedResume: string;
    jobDescription: string;
}

export const useGenerateCoverLetter = () => {
    const generateCoverLetterMutation = useMutation({
        mutationFn: async ({ parsedResume, jobDescription }: GenerateCoverLetterArgs) => {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND}/api/cover-letter`, {
                parsedResume,
                jobDescription
            });
            if (response.status === 200) return response.data.coverLetter.response.candidates[0].content.parts[0].text;
            else throw new Error('Error generating cover letter');
        },
        onSuccess: (coverLetter) => {
            toast({
                title: "Cover Letter Generated Successfully",
                description: "",
            });
        },
        onError: () => {
            toast({
                title: "Error",
                description: "An unexpected error occurred. Please try again.",
            });
        },
    });

    return {
        loading: generateCoverLetterMutation.status === "pending",
        coverLetter: generateCoverLetterMutation.data || '',
        setCoverLetter: (coverLetter: string) => { },
        generateCoverLetter: (parsedResume: string, jobDescription: string) => {
            generateCoverLetterMutation.mutate({ parsedResume, jobDescription });
        },
    };
};