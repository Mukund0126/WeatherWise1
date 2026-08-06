import React from "react";
import { Navbar } from "@/components/layout/navbar";
import { PageContainer } from "@/components/layout/page-container";
import { SignupForm } from "@/modules/authentication/signup-form";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar showProfile={false} />
      <PageContainer
        size="sm"
        className="flex items-center justify-center py-10 md:py-16"
      >
        <SignupForm />
      </PageContainer>
    </div>
  );
}
