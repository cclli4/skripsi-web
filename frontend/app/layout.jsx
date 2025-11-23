export const metadata = {
  title: "Sistem Diagnosis Risiko Kanker Payudara",
  description: "Frontend untuk diagnosis awal risiko kanker payudara",
};

import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body style={{ fontFamily: 'system-ui, Arial, sans-serif', margin: 0 }}>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}