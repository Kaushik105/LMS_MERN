import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

function PaymentCancelPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-72px)] w-full bg-slate-100 px-4 py-10">
      <div className="mx-auto max-w-2xl rounded-xl border border-red-200 bg-white p-8 shadow-sm">
        <div className="mb-4 flex items-center gap-3 text-red-600">
          <AlertTriangle className="h-8 w-8" />
          <h1 className="text-3xl font-bold">Payment Not Completed</h1>
        </div>

        <p className="mb-6 text-slate-600">
          Your payment was canceled or could not be processed. No amount was charged.
          You can try again from the course details page.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            onClick={() => navigate("/student/courses")}
            className="cursor-pointer"
          >
            <ArrowLeft />
            Back To Courses
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="cursor-pointer"
          >
            <RefreshCw />
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
}

export default PaymentCancelPage;
