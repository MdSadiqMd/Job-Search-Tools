import { useState } from 'react';
import axios from 'axios';

import { toast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';

interface UploadFileArgs {
    base64File: string;
    fileType: string;
}

interface UploadFileResponse {
    parsedResumeContents: string;
}

const useFileUpload = () => {
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

    const uploadFileMutation = useMutation<UploadFileResponse, Error, UploadFileArgs>({
        mutationFn: async ({ base64File, fileType }: UploadFileArgs) => {
            const response = await axios.post<UploadFileResponse>(`${process.env.NEXT_PUBLIC_BACKEND}/api/parse-resume`, {
                file: base64File,
                fileType
            });
            return response.data;
        },
        onSuccess: () => {
            toast({
                title: "File uploaded successfully",
                description: `${uploadedFileName} has been uploaded and its content has been added to the resume field.`,
            });
        },
        onError: () => {
            toast({
                title: "Error uploading file",
                description: "There was an issue uploading the file. Please try again.",
            });
        },
        onSettled: () => {
            setUploadedFileName(null);
        }
    });

    const handleFileUploadWrapper = async (file: File, updateResume: (content: string) => void) => {
        setUploadedFileName(file.name);
        try {
            const base64File = await fileToBase64(file);
            uploadFileMutation.mutate({ base64File, fileType: file.type }, {
                onSuccess: (data) => {
                    updateResume(data.parsedResumeContents || '');
                }
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "An unexpected error occurred. Please try again.",
            });
        }
    };

    return {
        loading: uploadFileMutation.status === "pending",
        uploadedFileName,
        setUploadedFileName,
        handleFileUpload: handleFileUploadWrapper,
    };
};

export default useFileUpload;