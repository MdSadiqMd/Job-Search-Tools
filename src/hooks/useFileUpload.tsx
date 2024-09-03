import { useState } from 'react';
import axios from 'axios';

import { toast } from '@/hooks/use-toast';

const useFileUpload = () => {
    const [loading, setLoading] = useState(false);
    const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const base64 = (reader.result as string).split(',')[1];
                resolve(base64);
            };
            reader.onerror = (error) => reject(error);
        });
    };

    const handleFileUpload = async (file: File, updateResume: (content: string) => void) => {
        setLoading(true);
        setUploadedFileName(file.name);
        try {
            const base64File = await fileToBase64(file);
            const fileType = file.type;
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND}/api/parse-resume`, {
                file: base64File,
                fileType
            });
            console.log(response);
            if (response.status === 200) {
                const { data } = response;
                updateResume(data.parsedResumeContents || '');
                toast({
                    title: "File uploaded successfully",
                    description: `${file.name} has been uploaded and its content has been added to the resume field.`,
                });
            } else {
                toast({
                    title: "Error uploading file",
                    description: "There was an issue uploading the file. Please try again.",
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
        uploadedFileName,
        setUploadedFileName,
        handleFileUpload,
    };
};

export default useFileUpload;