import { useState } from 'react';
import axios from 'axios';

import { toast } from '@/hooks/use-toast';

export const useGenerateCoverLetter = () => {
    const [loading, setLoading] = useState(false);
    const [coverLetter, setCoverLetter] = useState('');

    const generateCoverLetter = async (parsedResume: string, jobDescription: string) => {
        setLoading(true);
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND}/api/cover-letter`, {
                parsedResume,
                jobDescription
            });
            if (response.status === 200) {
                const { data } = response;
                setCoverLetter(data.coverLetter.response.candidates[0].content.parts[0].text);
                toast({
                    title: "Cover Letter Generated Successfully",
                    description: "",
                });
            } else {
                toast({
                    title: "Error generating cover letter",
                    description: "There was an issue generating cover letter. Please try again.",
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "An unexpected error occurred. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        coverLetter,
        setCoverLetter,
        generateCoverLetter,
    };
};