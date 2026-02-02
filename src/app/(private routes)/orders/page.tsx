import React from "react";

export interface PageProps {
  children?: React.ReactNode;
}

export default function Page({ children }: PageProps) {
  return <div>{children}</div>;
}
