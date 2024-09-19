"use client";

import Image from "next/image";
import { ArrowRight, Clock } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "./button";

interface ToolCardProps {
    icon: string;
    title: string;
    description: string;
    action: string;
    comingSoon: boolean;
    href: string;
}

export function ToolCard({
    icon,
    title,
    description,
    action,
    comingSoon,
    href
}: ToolCardProps) {
    const router = useRouter();
    const handleClick = (href: string) => {
        router.push(`/${href}`);
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col">
            <div className="flex items-center mb-4 space-x-3">
                <Image src={icon} alt="" width={40} height={40} className="mb-2" />
                <h2 className="text-xl font-semibold text-green-700 ml-0">{title}</h2>
            </div>
            <p className="text-gray-600 mb-4 flex-grow">{description}</p>
            {comingSoon ? (
                <div className="flex items-center text-orange-500">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>Coming Soon</span>
                </div>
            ) : (
                <Button
                    className="bg-green-500 text-white w-[50%] px-4 py-2 rounded-md flex items-center justify-center hover:bg-green-600 transition-colors"
                    onClick={() => handleClick(href)}
                >
                    {action}
                    <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            )}
        </div>
    );
}