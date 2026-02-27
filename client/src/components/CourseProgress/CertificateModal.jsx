import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Award, Download } from "lucide-react";
import { toast } from "react-hot-toast";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";

const CertificateModal = ({ isOpen, onOpenChange, user, course }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handlePrintCertificate = async () => {
    try {
      if (isGenerating) return;
      setIsGenerating(true);

      const element = document.getElementById("certificate-content");
      if (!element) {
        toast.error("Certificate element not found!");
        setIsGenerating(false);
        return;
      }

      toast.loading("Generating PDF... Please wait.");

      const fileName = `Certificate_${user?.name?.replace(/\\s+/g, "_") || "User"}_${course?.courseTitle?.replace(/\\s+/g, "_") || "Course"}.pdf`;

      // Define explicit dimensions for high-quality landscape A4-like capture
      const certWidth = 1131; // 800 * 1.414
      const certHeight = 800;

      const dataUrl = await toPng(element, {
        quality: 1,
        pixelRatio: 2,
        cacheBust: true,
        width: certWidth,
        height: certHeight,
        style: {
          transform: "scale(1)",
          transformOrigin: "top left",
          width: `${certWidth}px`,
          height: `${certHeight}px`,
          maxWidth: "none",
          maxHeight: "none",
        },
      });

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "pt",
        format: [certWidth, certHeight],
      });

      pdf.addImage(dataUrl, "PNG", 0, 0, certWidth, certHeight);
      pdf.save(fileName);

      toast.dismiss();
      toast.success("Certificate downloaded successfully!");
      setIsGenerating(false);
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.dismiss();
      toast.error("Failed to generate PDF. See console for details.");
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-4xl p-0 overflow-hidden bg-transparent border-none shadow-2xl"
        aria-describedby="certificate-desc"
      >
        <VisuallyHidden>
          <DialogTitle>Course Certificate</DialogTitle>
          <DialogDescription id="certificate-desc">
            Your generated certificate for completing the course.
          </DialogDescription>
        </VisuallyHidden>

        {/* Print Styles for Certificate */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
          @media print {
            body * {
              visibility: hidden;
            }
            .certificate-container, .certificate-container * {
              visibility: visible;
            }
            .certificate-container {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100vh;
              padding: 2cm !important;
              display: flex;
              align-items: center;
              justify-content: center;
              background: white !important;
            }
            .hide-on-print {
              display: none !important;
            }
          }
        `,
          }}
        />

        <div className="w-full max-w-4xl mx-auto overflow-auto custom-scrollbar flex justify-center p-4">
          <div
            id="certificate-content"
            className="certificate-container shrink-0 relative p-12 flex flex-col items-center justify-center text-center overflow-hidden"
            style={{
              backgroundColor: "#ffffff",
              width: "1131px",
              height: "800px",
            }}
          >
            {/* Outer border (instead of Tailwind utility) */}
            <div
              className="absolute inset-0 m-4 border-8 border-double"
              style={{ borderColor: "#312e81" }}
            />

            {/* Decorative corners */}
            <div
              className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 opacity-50"
              style={{ borderColor: "#312e81" }}
            />
            <div
              className="absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 opacity-50"
              style={{ borderColor: "#312e81" }}
            />
            <div
              className="absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 opacity-50"
              style={{ borderColor: "#312e81" }}
            />
            <div
              className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 opacity-50"
              style={{ borderColor: "#312e81" }}
            />

            <div
              className="w-full flex-1 border-2 p-12 flex flex-col items-center relative z-10"
              style={{
                backgroundColor: "rgba(255,255,255,0.9)",
                borderColor: "rgba(49, 46, 129, 0.1)",
              }}
            >
              <div className="mb-8">
                <Award
                  className="w-20 h-20 mx-auto opacity-80"
                  style={{ color: "#eab308" }}
                />
              </div>

              <h1
                className="text-4xl md:text-5xl font-black tracking-widest uppercase font-serif mb-2"
                style={{ color: "#1e293b" }}
              >
                Certificate of Completion
              </h1>
              <p
                className="text-sm tracking-widest uppercase mb-12"
                style={{ color: "#64748b" }}
              >
                This is proudly presented to
              </p>

              <h2
                className="text-5xl md:text-6xl font-black mb-8 border-b-2 pb-4 px-12 italic font-serif"
                style={{
                  color: "#312e81",
                  borderColor: "rgba(49, 46, 129, 0.2)",
                }}
              >
                {user?.name || "Student Name"}
              </h2>

              <p className="max-w-xl text-lg mb-4" style={{ color: "#475569" }}>
                For successfully completing the comprehensive course:
              </p>

              <h3
                className="text-2xl font-bold mb-12"
                style={{ color: "#1e293b" }}
              >
                {course?.courseTitle}
              </h3>

              <div className="flex justify-between w-full mt-auto pt-8 px-12">
                <div className="text-center">
                  <div
                    className="w-40 border-b mb-2"
                    style={{ borderColor: "#94a3b8" }}
                  ></div>
                  <p
                    className="text-sm font-bold uppercase tracking-widest"
                    style={{ color: "#475569" }}
                  >
                    {course?.creator?.name || "Instructor Name"}
                  </p>
                  <p className="text-xs" style={{ color: "#94a3b8" }}>
                    Lead Instructor
                  </p>
                </div>

                <div className="text-center">
                  <div
                    className="w-40 border-b mb-2 pb-1 font-medium"
                    style={{ borderColor: "#94a3b8", color: "#1e293b" }}
                  >
                    {new Date().toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                  <p
                    className="text-sm font-bold uppercase tracking-widest"
                    style={{ color: "#475569" }}
                  >
                    Date Issued
                  </p>
                </div>
              </div>

              {/* Seal */}
              <div
                className="absolute bottom-6 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full border-4 flex items-center justify-center opacity-90 rotate-12"
                style={{ borderColor: "#eab308", backgroundColor: "#fefce8" }}
              >
                <div
                  className="w-20 h-20 rounded-full border flex items-center justify-center"
                  style={{ borderColor: "#ca8a04" }}
                >
                  <span
                    className="font-bold text-xs uppercase text-center leading-tight tracking-widest"
                    style={{ color: "#ca8a04" }}
                  >
                    Official
                    <br />
                    Learning
                    <br />
                    Seal
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center p-4 bg-slate-900 rounded-b-xl hide-on-print">
          <Button
            onClick={handlePrintCertificate}
            disabled={isGenerating}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-12 px-8 rounded-xl shadow-lg border-2 border-indigo-500 disabled:opacity-50"
          >
            <Download className="mr-2 h-5 w-5" /> Download / Print PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CertificateModal;
