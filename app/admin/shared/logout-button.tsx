"use client";

import { ReactNode } from "react";
import { signOut } from "next-auth/react";

type LogoutButtonProps = {
  children: ReactNode;
  className?: string;
};

export default function LogoutButton({
  children,
  className,
}: LogoutButtonProps) {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/" })}
      className={className}
    >
      {children}
    </button>
  );
}
