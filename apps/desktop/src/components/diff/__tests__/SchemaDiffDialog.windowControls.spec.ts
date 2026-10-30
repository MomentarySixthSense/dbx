import { describe, expect, it, vi } from "vitest";
import { minimizeCurrentWindow, shouldShowWindowControls } from "@/composables/useWindowControls";

const windowApi = vi.hoisted(() => ({
  minimize: vi.fn(),
  getCurrentWindow: vi.fn(() => ({ minimize: windowApi.minimize })),
}));

vi.mock("@tauri-apps/api/window", () => ({ getCurrentWindow: windowApi.getCurrentWindow }));

describe("schema diff window controls", () => {
  it.each([
    ["Windows desktop", false, true, true],
    ["Linux desktop", false, true, true],
    ["macOS desktop", true, true, false],
    ["web", false, false, false],
  ])("shows the minimize control only for %s", (_platform, isMac, isDesktop, expected) => {
    expect(shouldShowWindowControls(isMac, isDesktop)).toBe(expected);
  });

  it("minimizes the current native window", async () => {
    await minimizeCurrentWindow();
    expect(windowApi.minimize).toHaveBeenCalledOnce();
  });
});
