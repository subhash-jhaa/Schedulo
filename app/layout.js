import { Syne, Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "Schedulo | Simplified Scheduling",
  description: "The professional way to share your availability. Connect your calendar, set your rules, and let Schedulo handle the rest.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${syne.variable} ${inter.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col bg-[#080C10] text-white">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}

// DEPLOYMENT CHECKLIST:
// 1. Push code to GitHub
// 2. Connect repo to vercel.com
// 3. Add all .env.local vars in Vercel dashboard
// 4. Set NEXT_PUBLIC_APP_URL to your Vercel domain
// 5. Update Clerk allowed origins with Vercel domain
// 6. Update Google OAuth redirect URI with Vercel domain
// 7. Run npx drizzle-kit push on production DB once
// 8. Deploy → get live URL → share in submission
