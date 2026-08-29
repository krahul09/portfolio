import type { Metadata } from "next";
import { ContactPane } from "@/components/panes/contact-pane";
import { getFile } from "@/data/workspace";

const file = getFile("contact");

export const metadata: Metadata = {
  title: file?.title,
  description: file?.description,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return <ContactPane />;
}
