import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Cover Letter Generator',
    description: 'Create personalized and professional cover letters effortlessly with our intuitive Cover Letter Generator.',
};

const JobLayout: React.FC<{ children?: React.ReactNode; }> = (props) => {
    return (
        <div>
            <div>{props.children}</div>
        </div>
    );
};

export default JobLayout;