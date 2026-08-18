import { RoleAccessGate } from "@/src/features/access-control";

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleAccessGate allowedRoles={["USER", "ADMIN", "DISPATCHER"]}>
      {children}
    </RoleAccessGate>
  );
}
