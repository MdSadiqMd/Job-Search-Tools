import React from 'react';
import { Upload, X } from 'lucide-react';

import { Button } from "@/components/ui/button";

interface FileUploadButtonProps {
    uploadedFileName: string | null;
    loading: boolean;
    handleUploadClick: () => void;
    handleRemoveFile: () => void;
}

const FileUploadButton: React.FC<FileUploadButtonProps> = ({
    uploadedFileName,
    loading,
    handleUploadClick,
    handleRemoveFile,
}) => {
    return (
        <Button
            variant="outline"
            className="flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-100"
            onClick={uploadedFileName ? undefined : handleUploadClick}
            disabled={loading}
        >
            {uploadedFileName ? (
                <>
                    <span className="truncate max-w-[150px]">{uploadedFileName}</span>
                    <X
                        size={16}
                        className="cursor-pointer text-red-500 hover:text-red-600"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFile();
                        }}
                    />
                </>
            ) : (
                <>
                    <Upload size={16} />
                    {loading ? 'Uploading...' : 'Upload'}
                </>
            )}
        </Button>
    );
};

export default FileUploadButton;