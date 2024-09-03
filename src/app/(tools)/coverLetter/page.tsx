"use client";

import { useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import FileUploadButton from '@/components/ui/fileUploadButton';
import { useFileUpload, useGenerateCoverLetter } from '@/hooks';
import { coverLetterInputSchema } from '@/types';
import { handleDownloadPDF } from '@/utils';

type FormData = z.infer<typeof coverLetterInputSchema>;

export default function Page() {
  const { control, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(coverLetterInputSchema),
    defaultValues: {
      jobDescription: '',
      resume: ''
    }
  });

  const { uploadedFileName, setUploadedFileName, handleFileUpload } = useFileUpload();
  const { loading, coverLetter, setCoverLetter, generateCoverLetter } = useGenerateCoverLetter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleResumePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].kind === 'file') {
        e.preventDefault();
        const file = items[i].getAsFile();
        if (file) {
          handleFileUpload(file, (content) => {
            setValue('resume', content);
          });
        }
        break;
      }
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file, (content) => setValue('resume', content));
  };

  const handleRemoveFile = () => {
    setValue('resume', '');
    setUploadedFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onSubmit = (data: FormData) => {
    generateCoverLetter(data.resume, data.jobDescription);
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-green-50 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h1 className="text-3xl font-bold text-green-800 mb-6">AI Cover Letter Generator</h1>

          <div className="mb-6">
            <label htmlFor="jobDescription" className="block text-md font-medium text-gray-700 mb-2">
              Job Description
            </label>
            <Controller
              name="jobDescription"
              control={control}
              render={({ field }) => (
                <Textarea
                  id="jobDescription"
                  placeholder="Paste the job description here..."
                  {...field}
                  className="min-h-[200px] w-full border-gray-300 focus:border-green-500 focus:ring-green-500"
                />
              )}
            />
            {errors.jobDescription && (
              <p className="text-red-500 text-sm mt-1">{errors.jobDescription.message}</p>
            )}
          </div>

          <div className="mb-6">
            <label htmlFor="resume" className="block text-md font-medium text-gray-700 mb-2">
              Resume
            </label>
            <div className="flex items-end gap-4">
              <Controller
                name="resume"
                control={control}
                render={({ field }) => (
                  <Textarea
                    id="resume"
                    placeholder="Paste your resume here or upload a file..."
                    {...field}
                    onChange={(e) => setValue('resume', e.target.value)}
                    onPaste={handleResumePaste}
                    className="min-h-[150px] w-full border-gray-300 focus:border-green-500 focus:ring-green-500"
                  />
                )}
              />
              {errors.resume && (
                <p className="text-red-500 text-sm mt-1">{errors.resume.message}</p>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileInputChange}
                className="hidden"
                accept=".txt,.pdf,.doc,.docx"
              />
              <FileUploadButton
                uploadedFileName={uploadedFileName}
                loading={loading}
                handleUploadClick={handleUploadClick}
                handleRemoveFile={handleRemoveFile}
              />
            </div>
          </div>

          <Button
            onClick={handleSubmit(onSubmit)}
            className="bg-green-500 hover:bg-green-600 text-white"
            disabled={loading}
          >
            {loading ? 'Generating' : 'Generate Cover Letter'}
            {loading && <span className="ml-2">...</span>}
          </Button>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-green-800 mb-6">Cover Letter Preview</h2>
          <Textarea
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            placeholder="Your generated cover letter will appear here..."
            className="w-full h-[calc(100%-3rem)] min-h-[400px] p-4 border-gray-300 focus:border-green-500 focus:ring-green-500"
          />
          <Button
            onClick={() => handleDownloadPDF(coverLetter)}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded mt-4"
          >
            Download PDF
          </Button>
        </div>
      </div>
    </div>
  );
}