import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import {
  useUpdateUserProfileMutation,
  useUploadFileMutation,
} from "../Redux/userr.api";
import { useAuth } from "../contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  User,
  MapPin,
  Building,
  Phone,
  Mail,
  FileText,
  X,
  Download,
  Eye,
  Leaf,
  Upload,
  Loader2,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

// 📄 File Upload Section
const PDFUploadSection = ({ isEditing, uploadedFiles, onFilesUpdate }) => {
  const userState = useSelector((state) => state.user.user);
  const user = userState?.data ? userState.data : userState;
  const [uploadFile] = useUploadFileMutation();
  const [isUploading, setIsUploading] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const handleFileSelect = async (event) => {
    setIsSelecting(true);
    const files = Array.from(event.target.files);
    const validFiles = files.filter(
      (file) =>
        file.type === "application/pdf" || file.type.startsWith("image/")
    );

    if (validFiles.length === 0) {
      toast.error("Please select valid PDF or Image files");
      setIsSelecting(false);
      return;
    }

    setTimeout(() => {
      setSelectedFiles((prev) => {
        const newFiles = validFiles.filter(
          (file) =>
            !prev.some((f) => f.name === file.name && f.size === file.size)
        );
        return [...prev, ...newFiles];
      });
      toast.success(`${validFiles.length} new file(s) added`);
      setIsSelecting(false);
    }, 800);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error("No files selected!");
      return;
    }

    if (!user?._id) {
      toast.error("User ID not found!");
      return;
    }

    setIsUploading(true);
    try {
      for (const file of selectedFiles) {
        const response = await uploadFile({
          userId: user._id,
          file: file,
        }).unwrap();

        const newFile = {
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          size: file.size,
          uploadDate: new Date().toLocaleDateString("en-IN"),
          type: file.type,
          cloudinaryUrl: response.uploadedFiles?.[0]?.url,
        };

        onFilesUpdate((prev) => [...prev, newFile]);
        toast.success(`"${file.name}" uploaded successfully!`);
      }

      setShowSuccessPopup(true);
      setSelectedFiles([]);
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Failed to upload file(s)");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveSelectedFile = (index) => {
    const updated = [...selectedFiles];
    updated.splice(index, 1);
    setSelectedFiles(updated);
  };

  const handleViewFile = (file) => {
    const url = file.cloudinaryUrl
      ? file.cloudinaryUrl
      : URL.createObjectURL(file);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleDownloadFile = (file) => {
    const url = file.cloudinaryUrl || URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <>
      <Card className="shadow-2xl border-0 bg-gradient-to-br from-[#FFF8F5] to-[#28B8B4]/10 dark:from-gray-800 dark:to-[#28B8B4]/5 rounded-2xl">
        {/* Gradient Top Border */}
        <div className="h-1 bg-gradient-to-r from-[#2D50A1] to-[#28B8B4] rounded-t-2xl"></div>

        <CardHeader className="flex flex-col items-center justify-center pb-6 border-b border-[#28B8B4]/30">
          <CardTitle className="text-3xl font-extrabold bg-gradient-to-r from-[#2D50A1] to-[#28B8B4] bg-clip-text text-transparent flex flex-col items-center gap-2 text-center tracking-tight">
            <div className="flex items-center justify-center gap-3">
              <FileText className="w-8 h-8 text-[#28B8B4]" />
              <span>Upload Your 12 Months of Bill</span>
            </div>
            <p className="text-[#2D50A1]/80 dark:text-[#28B8B4]/80 text-lg font-medium">
              Know your monthly savings instantly
            </p>
          </CardTitle>
        </CardHeader>



        <CardContent className="pt-6 space-y-6">
          <label
            htmlFor="pdf-upload"
            className={`block cursor-pointer text-center p-6 rounded-xl border-2 border-dashed transition-all duration-300 ${isUploading || isSelecting
              ? "bg-[#28B8B4]/20 border-[#28B8B4]/40 cursor-not-allowed"
              : "bg-[#28B8B4]/10 border-[#28B8B4]/30 hover:bg-[#28B8B4]/20 hover:border-[#28B8B4]/50"
              }`}
          >
            {isSelecting ? (
              <>
                <Loader2 className="w-10 h-10 text-[#28B8B4] mx-auto mb-3 animate-spin" />
                <p className="text-[#2D50A1] dark:text-[#28B8B4] font-medium text-lg">
                  Loading files...
                </p>
              </>
            ) : (
              <>
                <Upload className="w-10 h-10 text-[#28B8B4] mx-auto mb-3" />
                <p className="text-[#2D50A1] dark:text-[#28B8B4] font-medium text-lg">
                  Select PDFs or Images
                </p>
                <p className="text-sm text-[#2D50A1]/70 dark:text-[#28B8B4]/70 mt-2">
                  Multiple files allowed • PDF, JPG, PNG
                </p>
              </>
            )}
          </label>

          <Input
            id="pdf-upload"
            type="file"
            multiple
            accept=".pdf,image/*"
            onChange={handleFileSelect}
            disabled={isUploading || isSelecting}
            className="hidden"
          />

          {selectedFiles.map((file, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 border border-[#28B8B4]/20 rounded-xl bg-white dark:bg-gray-800 hover:bg-[#28B8B4]/5 transition-all shadow-sm"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-[#2D50A1] dark:text-[#28B8B4]">
                    {file.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewFile(file)}
                    className="text-[#2D50A1] border-[#2D50A1]/20 hover:bg-[#2D50A1] hover:text-white"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveSelectedFile(index)}
                    disabled={isUploading}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}

          {selectedFiles.length > 0 && (
            <div className="flex justify-end">
              <Button
                onClick={handleUpload}
                disabled={isUploading}
                className="bg-gradient-to-r from-[#2D50A1] to-[#28B8B4] hover:from-[#2D50A1] hover:to-[#28B8B4] text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-0"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading...
                  </>
                ) : (
                  "Upload Files"
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ✅ Success Popup */}
      <AnimatePresence>
        {showSuccessPopup && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 flex items-center justify-center z-50"
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="relative bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-2xl border border-[#28B8B4]/20 text-center max-w-md mx-auto"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-[#2D50A1] to-[#28B8B4] rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-[#2D50A1] to-[#28B8B4] bg-clip-text text-transparent mb-2">
                Thank You, {user?.Name || "User"}!
              </h2>
              <p className="text-[#2D50A1] dark:text-[#28B8B4] mb-4">
                We’ve saved your bill successfully. Our team will review it and get back to you soon. 🌱
              </p>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSuccessPopup(false)}
                className="mt-2 px-6 py-3 bg-gradient-to-r from-[#2D50A1] to-[#28B8B4] hover:from-[#2D50A1] hover:to-[#28B8B4] text-white rounded-xl shadow-md font-medium"
              >
                Okay
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// 🧍‍♂ Main Profile Component
const UserProfile = () => {
  const { user: authUser } = useAuth();
  const userState = useSelector((state) => state.user.user);
  const user = userState?.data ? userState.data : userState;
  const [isEditing, setIsEditing] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [updateUserProfile, { isLoading }] = useUpdateUserProfileMutation();

  const formik = useFormik({
    initialValues: {
      email: user?.email || authUser?.email || "",
      mobile: user?.mobile || authUser?.mobile || "",
      companyName: user?.companyName || authUser?.companyName || "",
      district: user?.district || authUser?.district || "",
    },
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        const res = await updateUserProfile({
          userId: user?._id,
          data: {
            email: values.email,
            mobile: values.mobile,
            companyName: values.companyName,
            district: values.district,
          },
        }).unwrap();

        toast.success(res?.message || "Profile updated successfully!");
        setIsEditing(false);
      } catch (error) {
        console.error("❌ Update failed:", error);
        toast.error(error?.data || "Failed to update profile");
      }
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8F5] via-white to-[#28B8B4]/10 dark:from-gray-900 dark:via-gray-800 dark:to-[#28B8B4]/5 py-8 px-4">
      <div className="max-w-6xl mx-auto mb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">

          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#2D50A1] to-[#28B8B4] bg-clip-text text-transparent">
            Energy Profile
          </h1>
        </div>
        <p className="text-[#2D50A1] dark:text-[#28B8B4] text-lg font-medium">
          Manage your sustainable energy profile and documents
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid gap-8 lg:grid-cols-2">
        <Card className="shadow-2xl border-0 bg-gradient-to-br from-white to-[#FFF8F5] dark:from-gray-800 dark:to-gray-700 rounded-2xl">
          {/* Gradient Top Border */}
          <div className="h-1 bg-gradient-to-r from-[#2D50A1] to-[#28B8B4] rounded-t-2xl"></div>

          <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-[#28B8B4]/20">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-[#2D50A1] to-[#28B8B4] bg-clip-text text-transparent flex items-center gap-2">
              <User className="w-7 h-7 text-[#28B8B4]" />
              Profile Information
            </CardTitle>

            {!isEditing && (
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-gradient-to-r from-[#2D50A1] to-[#28B8B4] hover:from-[#2D50A1] hover:to-[#28B8B4] text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-0"
              >
                Edit Profile
              </Button>
            )}
          </CardHeader>

          <CardContent className="pt-6">
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              <div className="space-y-5">
                {[
                  ["email", "Email", Mail],
                  ["mobile", "Mobile", Phone],
                  ["companyName", "Company Name", Building],
                  ["district", "District", MapPin],
                ].map(([name, label, Icon]) => (
                  <div key={name} className="space-y-3">
                    <Label className="flex items-center gap-2 text-[#2D50A1] dark:text-[#28B8B4] font-semibold">
                      <Icon className="w-4 h-4" />
                      {label}
                    </Label>
                    <Input
                      name={name}
                      type={name === "email" ? "email" : "text"}
                      value={formik.values[name]}
                      onChange={formik.handleChange}
                      disabled={!isEditing}
                      className="border-2 border-[#28B8B4]/20 focus:border-[#28B8B4] focus:ring-2 focus:ring-[#28B8B4]/20 rounded-xl py-3 transition-all duration-300 disabled:bg-[#28B8B4]/5 disabled:text-gray-600"
                    />
                  </div>
                ))}
              </div>

              {isEditing && (
                <div className="flex justify-end gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    className="border-[#2D50A1] text-[#2D50A1] hover:bg-[#2D50A1] hover:text-white transition-all duration-300"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-gradient-to-r from-[#2D50A1] to-[#28B8B4] hover:from-[#2D50A1] hover:to-[#28B8B4] text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-0"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        <PDFUploadSection
          isEditing={isEditing}
          uploadedFiles={uploadedFiles}
          onFilesUpdate={setUploadedFiles}
        />
      </div>
    </div>
  );
};

export default UserProfile;