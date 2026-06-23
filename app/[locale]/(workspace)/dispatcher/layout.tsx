import { RoleAccessGate } from "@/src/features/access-control";
import RoleWorkspaceShell from "@/src/pages-layer/role-workspace/ui/RoleWorkspaceShell";

export default function DispatcherWorkspaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleAccessGate allowedRoles={["DISPATCHER", "ADMIN"]}>
      <RoleWorkspaceShell basePath="/dispatcher" defaultRoleLabel="Dispatcher">
        {children}
      </RoleWorkspaceShell>
    </RoleAccessGate>
  );
}
