"use client";
import React from "react";
import Code from "../_components/code";

export default function ProjectsPage() {
  return (
    <main className="flex flex-col gap-2 lg:gap-2 min-h-[90vh] w-full">
      <div className="text-3xl lg:text-5xl font-bold w-full text-center py-2">
        <h1>Setup</h1>
      </div>

      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed shadow-sm">
        <Code />
      </div>
    </main>
  );
}
