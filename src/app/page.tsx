"use client";

import { ToolCard } from "@/components/ui/toolcard";
import { tools } from "@/constants/tools.constants";

export default function Home() {
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