import type { MouseEvent } from "react";

import type { BackendMode, WorkspaceInfo } from "../../../types";

type WorkspaceCardProps = {
  backendMode: BackendMode;
  remoteBackendHost: string;
  workspace: WorkspaceInfo;
  workspaceName?: React.ReactNode;
  isActive: boolean;
  isCollapsed: boolean;
  addMenuOpen: boolean;
  addMenuWidth: number;
  onSelectWorkspace: (id: string) => void;
  onShowWorkspaceMenu: (event: MouseEvent, workspaceId: string) => void;
  onToggleWorkspaceCollapse: (workspaceId: string, collapsed: boolean) => void;
  onConnectWorkspace: (workspace: WorkspaceInfo) => void;
  onToggleAddMenu: (anchor: {
    workspaceId: string;
    top: number;
    left: number;
    width: number;
  } | null) => void;
  children?: React.ReactNode;
};

export function WorkspaceCard({
  backendMode,
  remoteBackendHost,
  workspace,
  workspaceName,
  isActive,
  isCollapsed,
  addMenuOpen,
  addMenuWidth,
  onSelectWorkspace,
  onShowWorkspaceMenu,
  onToggleWorkspaceCollapse,
  onConnectWorkspace,
  onToggleAddMenu,
  children,
}: WorkspaceCardProps) {
  const contentCollapsedClass = isCollapsed ? " collapsed" : "";
  const isRemote = backendMode === "remote";
  const resolvedRemoteHost = remoteBackendHost.trim() || "127.0.0.1:4732";

  return (
    <div className="workspace-card">
      <div
        className={`workspace-row ${isActive ? "active" : ""}${isRemote ? " is-remote" : ""}`}
        role="button"
        tabIndex={0}
        onClick={() => onSelectWorkspace(workspace.id)}
        onContextMenu={(event) => onShowWorkspaceMenu(event, workspace.id)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onSelectWorkspace(workspace.id);
          }
        }}
      >
        <div>
          <div className="workspace-name-row">
            <div className="workspace-title">
              <span className="workspace-name">{workspaceName ?? workspace.name}</span>
              {isRemote && (
                <span
                  className="workspace-remote-badge"
                  title={`Remote backend: ${resolvedRemoteHost}. Workspace paths resolve on the daemon host.`}
                >
                  remote
                </span>
              )}
              <button
                className={`workspace-toggle ${isCollapsed ? "" : "expanded"}`}
                onClick={(event) => {
                  event.stopPropagation();
                  onToggleWorkspaceCollapse(workspace.id, !isCollapsed);
                }}
                data-tauri-drag-region="false"
                aria-label={isCollapsed ? "Show agents" : "Hide agents"}
                aria-expanded={!isCollapsed}
              >
                <span className="workspace-toggle-icon">›</span>
              </button>
            </div>
            <button
              className="ghost workspace-add"
              onClick={(event) => {
                event.stopPropagation();
                const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
                const left = Math.min(
                  Math.max(rect.left, 12),
                  window.innerWidth - addMenuWidth - 12,
                );
                const top = rect.bottom + 8;
                onToggleAddMenu(
                  addMenuOpen
                    ? null
                    : {
                        workspaceId: workspace.id,
                        top,
                        left,
                        width: addMenuWidth,
                      },
                );
              }}
              data-tauri-drag-region="false"
              aria-label="Add agent options"
              aria-expanded={addMenuOpen}
            >
              +
            </button>
          </div>
        </div>
        {!workspace.connected && (
          <span
            className="connect"
            onClick={(event) => {
              event.stopPropagation();
              onConnectWorkspace(workspace);
            }}
          >
            connect
          </span>
        )}
      </div>
      <div
        className={`workspace-card-content${contentCollapsedClass}`}
        aria-hidden={isCollapsed}
        inert={isCollapsed ? true : undefined}
      >
        <div className="workspace-card-content-inner">{children}</div>
      </div>
    </div>
  );
}
