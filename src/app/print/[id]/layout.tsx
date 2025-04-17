// src/app/print/[id]/layout.tsx
export default function PrintLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <html lang="en">
        <head>
          <title>TCG Label Printing</title>
        </head>
        <body>{children}</body>
      </html>
    );
  }
  