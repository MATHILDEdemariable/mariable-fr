
import React from "react";
import BlogAdmin from "@/components/admin/BlogAdmin";
import AdminPasswordProtection from "@/components/admin/AdminPasswordProtection";
import { Toaster } from "@/components/ui/sonner";

const AdminBlog = () => {
  return (
    <AdminPasswordProtection>
      <div className="min-h-screen px-4 py-8">
        <div className="w-full max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-4 text-center mt-12">
            Administration du Blog
          </h1>
          <p className="text-lg text-center mb-6">
            Gérez les articles de votre blog depuis cette interface.
          </p>
          <BlogAdmin />
          <Toaster />
        </div>
      </div>
    </AdminPasswordProtection>
  );
};

export default AdminBlog;
