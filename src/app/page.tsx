"use client";

import { ToolCard } from "@/components/ui/toolcard";

export default function Home() {
  const tools = [
    {
      icon: "/letter.png",
      title: "AI Cover Letter Generator",
      description: "Create customized cover letters with AI assistance.",
      action: "Try Now",
      comingSoon: false,
      href: 'coverLetter'
    },
    {
      icon: "/application-tracker.png",
      title: "Job Application Tracker",
      description: "Simple Kanban board to organize your job applications.",
      action: "Try Now",
      comingSoon: false,
      href: ''
    },
    {
      icon: "/ats-scanner.png",
      title: "ATS Scanner",
      description: "Check if your resume is ATS-friendly.",
      action: "",
      comingSoon: true,
      href: ''
    },
    {
      icon: "/linkedin-profile.png",
      title: "LinkedIn Profile Optimizer",
      description: "Improve your LinkedIn profile visibility.",
      action: "",
      comingSoon: true,
      href: ''
    },
    {
      icon: "/resume-optimiser.png",
      title: "Resume Optimizer",
      description: "Get tips to enhance your resume.",
      action: "",
      comingSoon: true,
      href: ''
    },
    {
      icon: "/interview.png",
      title: "Interview Question Simulator",
      description: "Practice common interview questions.",
      action: "",
      comingSoon: true,
      href: ''
    },
    {
      icon: "/brand.png",
      title: "Personal Brand Statement Generator",
      description: "Create a compelling personal brand statement.",
      action: "",
      comingSoon: true,
      href: ''
    },
    {
      icon: "/networking.png",
      title: "Networking Email Template Builder",
      description: "Craft professional networking emails.",
      action: "",
      comingSoon: true,
      href: ''
    },
  ];

  return (
    <div className="w-screen h-screen px-4 py-8 bg-gradient-to-r from-green-200 via-emerald-300 to-teal-500 overflow-x-hidden">
      <h1 className="text-4xl font-bold text-green-800 mb-2">Free Job Search Tools</h1>
      <p className="text-xl text-gray-600 mb-8">Empower your job hunt with our suite of free, easy-to-use tools.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tools.map((tool, index) => (
          <ToolCard
            key={index}
            icon={tool.icon}
            title={tool.title}
            description={tool.description}
            action={tool.action}
            comingSoon={tool.comingSoon}
            href={tool.href}
          />
        ))}
      </div>
    </div>
  );
}