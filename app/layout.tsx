import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { LayoutWrapper } from "@/components/LayoutWrapper";
import StoreProvider from "@/lib/store/StoreProvider";
import { AuthProvider } from "@/lib/context/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Toaster } from "sonner";

const dmSans = DM_Sans({ 
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "Sunday School Manager",
  description: "A premium dashboard for managing your Sunday school lessons and students.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.className} antialiased bg-white text-slate-900`}>
        <AuthProvider>
          <StoreProvider>
            <ProtectedRoute>
              <LayoutWrapper>
                {children}
              </LayoutWrapper>
            </ProtectedRoute>
          </StoreProvider>
          <Toaster 
            position="top-right" 
            richColors 
            closeButton
            toastOptions={{
              style: {
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '1.25rem',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02)',
                fontFamily: 'inherit',
              },
              className: 'premium-toast',
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
