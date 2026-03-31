import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-gilroy",
  display: "swap",
});

export const metadata = {
  title: "Schedulo | Simplified Scheduling",
  description: "The professional way to share your availability. Connect your calendar, set your rules, and let Schedulo handle the rest.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${jakarta.variable} h-full antialiased`}>
      <head>
        <meta name="color-scheme" content="light" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-full flex flex-col bg-white text-[#0b3558]">
        {children}
      </body>
    </html>
  );
}

// DEPLOYMENT CHECKLIST:
// 1. Push code to GitHub
// 2. Connect repo to vercel.com
// 3. Add all .env.local vars in Vercel dashboard
// 4. Set NEXT_PUBLIC_APP_URL to your Vercel domain
// 6. Update Google OAuth redirect URI with Vercel domain
// 7. Run npx drizzle-kit push on production DB once
// 8. Deploy → get live URL → share in submission
