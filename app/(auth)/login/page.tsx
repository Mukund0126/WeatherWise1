import React from "react";
import { Navbar } from "@/components/layout/navbar";
import { PageContainer } from "@/components/layout/page-container";
import { LoginForm } from "@/modules/authentication/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar showProfile={false} />
      <PageContainer
        size="sm"
        className="flex items-center justify-center py-10 md:py-16"
      >
        <LoginForm />
      </PageContainer>
    </div>
  );
}
