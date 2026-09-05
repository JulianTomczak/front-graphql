import type { Metadata } from "next";
import ApolloClientProvider from "./providers/ApolloClientProvider";

export const metadata: Metadata = {
  title: "GraphQL Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <ApolloClientProvider>
          {children}
        </ApolloClientProvider>
      </body>
    </html>
  );
}