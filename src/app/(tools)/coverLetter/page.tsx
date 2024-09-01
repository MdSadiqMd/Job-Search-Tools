"use client";

import { useState, useRef } from 'react';
import { Upload } from 'lucide-react';
import axios from 'axios';
import jsPDF from 'jspdf';

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from '@/hooks/use-toast';

export default function Page() {
  const [jobDescription, setJobDescription] = useState('');
  const [resume, setResume] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverLetterRef = useRef<HTMLTextAreaElement>(null);

  const handleResumeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setResume(e.target.value);
  };

  const handleResumePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].kind === 'file') {
        e.preventDefault();
        const file = items[i].getAsFile();
        if (file) handleFileUpload(file);
        break;
      }
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      const base64File = await fileToBase64(file);
      const fileType = file.type;
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND}/api/parse-resume`, {
        file: base64File,
        fileType
      });
      if (response.status === 200) {
        const { data } = response;
        setResume(data.parsedResumeContents);
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
    }
  };

  const handleGenerateCoverLetter = async () => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND}/api/cover-letter`, {
        parsedResume: resume,
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
    }
  };

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

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
  };

  const stripHtmlTags = (html: string) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || '';
  };

  const handleDownloadPDF = () => {
    const cleanedCoverLetter = stripHtmlTags(coverLetter);
    const pdf = new jsPDF();
    const margin = 10;
    const pageWidth = pdf.internal.pageSize.width - 2 * margin;
    const lineHeight = 10;
    const textLines: string[] = pdf.splitTextToSize(cleanedCoverLetter, pageWidth);
    const pageHeight = pdf.internal.pageSize.height - 2 * margin;
    let y = margin;

    textLines.forEach((line: string) => {
      if (y + lineHeight > pageHeight) {
        pdf.addPage();
        y = margin;
      }
      pdf.text(line, margin, y);
      y += lineHeight;
    });

    pdf.save('cover_letter.pdf');
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-green-50 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h1 className="text-3xl font-bold text-green-800 mb-6">AI Cover Letter Generator</h1>

          <div className="mb-6">
            <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700 mb-2">
              Job Description
            </label>
            <Textarea
              id="jobDescription"
              placeholder="Paste the job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="min-h-[200px] w-full border-gray-300 focus:border-green-500 focus:ring-green-500"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-2">
              Resume
            </label>
            <div className="flex items-end gap-4">
              <Textarea
                id="resume"
                placeholder="Paste your resume here or upload a file..."
                value={resume}
                onChange={handleResumeChange}
                onPaste={handleResumePaste}
                className="min-h-[150px] w-full border-gray-300 focus:border-green-500 focus:ring-green-500"
              />
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileInputChange}
                className="hidden"
                accept=".txt,.pdf,.doc,.docx"
              />
              <Button
                variant="outline"
                className="flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-100"
                onClick={handleUploadClick}
              >
                <Upload size={16} />
                Upload
              </Button>
            </div>
          </div>

          <Button
            onClick={handleGenerateCoverLetter}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
          >
            Generate Cover Letter
          </Button>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-green-800 mb-6">Cover Letter Preview</h2>
          <Textarea
            ref={coverLetterRef}
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            placeholder="Your generated cover letter will appear here..."
            className="w-full h-[calc(100%-3rem)] min-h-[400px] p-4 border-gray-300 focus:border-green-500 focus:ring-green-500"
          />
          <Button
            onClick={handleDownloadPDF}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded mt-4"
          >
            Download
          </Button>
        </div>
      </div>
    </div>
  );
}