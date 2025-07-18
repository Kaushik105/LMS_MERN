import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import VideoPlayer from "@/components/videoPlayer";
import { useAuth } from "@/context/authContext";
import { useStudent } from "@/context/studentContext";
import {
  createPaymentService,
  fetchStudentViewCourseDetailsByIdService,
} from "@/services";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import axios from "axios";
import { CheckCircle, LockIcon, PlayCircleIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function StudentViewCourseDetails() {
  const { id } = useParams();
  const auth = useAuth();
  const {
    studentViewCourseDetails,
    setStudentViewCourseDetails,
    studentViewCourseDetailsId,
    setStudentViewCourseDetailsId,
  } = useStudent();
  const [openFreePreviewDialog, setOpenFreePreviewDialog] = useState(false);
  const [selectedPreviewLecture, setSelectedPreviewLecture] = useState(null);
  const [approvalUrl, setApprovalUrl] = useState("");

  // paypal inital Options
  const initialOptions = {
    "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID,
    "enable-funding": "venmo",
    "disable-funding": "",
    "buyer-country": "US",
    currency: "USD",
    "data-page-type": "product-details",
    components: "buttons",
    "data-sdk-integration-source": "developer-studio",
  };

  async function fetchStudentViewCourseDetails(id) {
    const response = await fetchStudentViewCourseDetailsByIdService(id);
    setStudentViewCourseDetails(response?.data);
  }

  async function createOrder() {
    const paymentPayload = {
      userId: auth?.auth?.user?._id,
      username: auth?.auth?.user?.userName,
      userEmail: auth?.auth?.user?.userEmail,
      orderStatus: "pending",
      paymentMethod: "paypal",
      paymentStatus: "initiated",
      orderDate: new Date(),
      paymentId: "",
      payerId: "",
      instructorId: studentViewCourseDetails?.instructorId,
      instructorName: studentViewCourseDetails?.instructorName,
      courseImage: studentViewCourseDetails?.image,
      courseTitle: studentViewCourseDetails?.title,
      courseId: studentViewCourseDetails?._id,
      coursePricing: studentViewCourseDetails?.pricing,
    };
    try {
      const response = await fetch(
        "http://localhost:3000/api/v1/student/order/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          // use the "body" param to optionally pass additional order information
          // like product ids and quantities
          body: JSON.stringify(paymentPayload),
        }
      );

      const orderData = await response.json();
      console.log(orderData, "create");

      if (orderData.id) {
        return orderData.id;
      } else {
        const errorDetail = orderData?.details?.[0];
        const errorMessage = errorDetail
          ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
          : JSON.stringify(orderData);

        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error(error);
      setMessage(`Could not initiate PayPal Checkout...${error}`);
      throw error;
    }
  }

  async function captureOrder(data, actions) {
    try {
      const response = await fetch(`http://localhost:3000/api/v1/student/order/${data.orderID}/capture`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const orderData = await response?.json();
      // Three cases to handle:
      //   (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
      //   (2) Other non-recoverable errors -> Show a failure message
      //   (3) Successful transaction -> Show confirmation or thank you message

;

      const errorDetail = orderData?.details?.[0];

      if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
        // (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
        // recoverable state, per https://developer.paypal.com/docs/checkout/standard/customize/handle-funding-failures/
        return actions.restart();
      } else if (errorDetail) {
        // (2) Other non-recoverable errors -> Show a failure message
        throw new Error(`${errorDetail.description} (${orderData.debug_id})`);
      } else {
        // (3) Successful transaction -> Show confirmation or thank you message
        // Or go to another URL:  actions.redirect('thank_you.html');
        // actions.redirect("http://localhost:5173/student/payment-return")
        return actions.redirect("http://localhost:5173/student/payment-return")
      }
    } catch (error) {
      console.error(error);
      setMessage(`Sorry, your transaction could not be processed...${error}`);
    }
  }

  useEffect(() => {
    if (id !== null) {
      setStudentViewCourseDetailsId(id);
      fetchStudentViewCourseDetails(id);
    }
  }, [id]);

  function handleFreePreviewDialog(freePreviewLecture) {
    setSelectedPreviewLecture(freePreviewLecture);
    setOpenFreePreviewDialog(true);
  }
  return (
    <div className="bg-slate-800 min-h-screen">
      <div className="m-4 p-4 pt-6 rounded-lg bg-slate-900">
        <div className="text-white text-3xl font-bold tracking-wider">
          {studentViewCourseDetails?.title}
        </div>
        <div className="text-gray-300 mt-2 text-lg font-medium">
          {studentViewCourseDetails?.subtitle}
        </div>
        <div className="my-4 text-gray-300 flex items-center gap-3">
          <p className="text-gray-400">
            by{" "}
            <span className="font-semibold text-gray-300">
              {studentViewCourseDetails?.instructorName}
            </span>
          </p>
          •
          <p className="text-gray-400">
            <span className="font-semibold text-gray-400">
              {studentViewCourseDetails?.category}
            </span>
          </p>
          •
          <p className="text-gray-400">
            <span className="font-semibold text-gray-400">
              {" "}
              on {studentViewCourseDetails?.date.split("T")[0]}
            </span>
          </p>
        </div>
      </div>
      <section className="m-4 rounded-lg p-4 bg-slate-900 text-white">
        <div className="text-2xl font-bold pb-6">Objectives</div>
        <div className=" grid gap-3 grid-cols-1 md:grid-cols-2">
          {studentViewCourseDetails && studentViewCourseDetails.objectives
            ? studentViewCourseDetails.objectives.split(",").map((item) => (
                <span key={item} className="flex items-center gap-2">
                  <CheckCircle color="green" /> {item}
                </span>
              ))
            : null}
        </div>
      </section>
      <div className="w-full h-full flex flex-col md:flex-row">
        <section className="m-4 rounded-lg md:w-full p-4 bg-slate-900 text-white">
          <div className="text-2xl font-bold pb-6">Course Curriculum</div>
          <div className=" grid gap-5 grid-cols-1">
            {studentViewCourseDetails &&
            studentViewCourseDetails?.curriculum?.length > 0
              ? studentViewCourseDetails?.curriculum?.map((item) => (
                  <li
                    key={item.title}
                    onClick={
                      item?.freePreview === "true"
                        ? () => handleFreePreviewDialog(item)
                        : null
                    }
                    className={`font-semibold ${
                      item?.freePreview === "false" ? "" : "cursor-pointer"
                    } list-none flex gap-2 items-center text-gray-200`}
                  >
                    {item?.freePreview === "true" ? (
                      <PlayCircleIcon />
                    ) : (
                      <LockIcon />
                    )}
                    {item?.title}
                  </li>
                ))
              : null}
          </div>
        </section>

        {/* <section className="m-4 h-full rounded-lg md:w-full p-4 bg-slate-900 text-white">
          <div className="text-2xl font-bold pb-6">Course Preview</div>
          <div className=" flex w-full aspect-video flex-col">
            {studentViewCourseDetails &&
            studentViewCourseDetails?.curriculum?.length > 0
              ? studentViewCourseDetails?.curriculum
                  ?.map((item) => (item?.freePreview === "true" ? item : null))
                  .slice(0, 1)
                  .map((item) => (
                    <div>
                      <VideoPlayer
                        url={item?.videoUrl}
                      className="h-full w-full object-contain"
                      />
                      <p className="text-lg font-medium text-gray-200">
                        {item?.title}
                      </p>
                    </div>
                  ))
              : null}
          </div>
          <Button
            className={
              "bg-gray-300 cursor-pointer p-6 hover:bg-white w-full text-slate-900 text-xl font-bold my-4"
            }
          >
            Buy Now
          </Button>
        </section> */}
        <section className="m-4 h-full rounded-lg md:w-full p-4 bg-slate-900 text-white">
          <div className="text-2xl font-bold pb-6">Course Preview</div>

          <div className="w-full">
            {studentViewCourseDetails &&
            studentViewCourseDetails?.curriculum?.length > 0
              ? studentViewCourseDetails.curriculum
                  .filter((item) => item?.freePreview === "true")
                  .slice(0, 1)
                  .map((item) => (
                    <div
                      key={item.title}
                      className="aspect-video w-full relative mb-4"
                    >
                      <div className="absolute inset-0">
                        <VideoPlayer
                          url={item?.videoUrl}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <p className="text-lg font-medium text-gray-200 mt-2">
                        {item?.title}
                      </p>
                    </div>
                  ))
              : null}
          </div>

          <div className="App">
            <PayPalScriptProvider options={initialOptions}>
              <PayPalButtons
                style={{
                  shape: "rect",
                  layout: "vertical",
                  color: "gold",
                  label: "buynow",
                }}
                createOrder={createOrder}
                onApprove={captureOrder}
              />
            </PayPalScriptProvider>
          </div>
        </section>
      </div>
      <Dialog
        open={openFreePreviewDialog}
        onOpenChange={setOpenFreePreviewDialog}
      >
        <DialogContent
          showCloseButton={false}
          className="max-w-[90vw] sm:max-w-[700px] bg-slate-900 border-slate-700"
        >
          <DialogHeader>
            <DialogTitle className="text-white text-2xl font-semibold">
              Course Preview
            </DialogTitle>
          </DialogHeader>

          {/* Video Container with aspect ratio */}
          <p className="text-white text-xl">{selectedPreviewLecture?.title}</p>
          <div className="w-full aspect-video bg-black rounded-md overflow-hidden">
            <VideoPlayer
              url={selectedPreviewLecture?.videoUrl}
              className="w-full h-full object-contain"
            />
          </div>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default StudentViewCourseDetails;
