import { Button } from "@/components/ui/button";
import { CheckCircle2, LibraryBig, PlayCircle } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

function PaymentReturnPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-72px)] w-full bg-emerald-50 px-4 py-10">
      <div className="mx-auto max-w-2xl rounded-xl border border-emerald-200 bg-white p-8 shadow-sm">
        <div className="mb-4 flex items-center gap-3 text-emerald-600">
          <CheckCircle2 className="h-8 w-8" />
          <h1 className="text-3xl font-bold">Payment Successful</h1>
        </div>

        <p className="mb-6 text-slate-600">
          Your enrollment is confirmed. You can start learning immediately from your
          purchased courses.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            onClick={() => navigate("/student/my-courses")}
            className="cursor-pointer"
          >
            <LibraryBig />
            Go To My Courses
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/student/courses")}
            className="cursor-pointer"
          >
            <PlayCircle />
            Explore More Courses
          </Button>
        </div>
      </div>
    </div>
  );
}

export default PaymentReturnPage;
