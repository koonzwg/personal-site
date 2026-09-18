import { renderToBuffer } from "@react-pdf/renderer";
import { createElement } from "react";
import { ResumeDocument } from "@/lib/resume-pdf";

// Generated at build time from src/lib/resume.ts — edit the data, the PDF follows.
export const dynamic = "force-static";

export async function GET() {
  const pdf = await renderToBuffer(createElement(ResumeDocument));
  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'inline; filename="William-Koonz-Resume.pdf"',
      "Cache-Control": "public, max-age=3600",
    },
  });
}
