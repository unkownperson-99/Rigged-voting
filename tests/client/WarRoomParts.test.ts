// @vitest-environment jsdom
import { html, render, TemplateResult } from "lit";
import { describe, expect, it, vi } from "vitest";
import {
  wrButton,
  wrPanel,
  wrStat,
  wrTabs,
} from "../../src/client/components/warroom/WarRoomParts";

function mount(template: TemplateResult): HTMLElement {
  const host = document.createElement("div");
  document.body.appendChild(host);
  render(template, host);
  return host;
}

describe("war-room helpers", () => {
  it("renders a panel with its title, body and chamfer option", () => {
    const host = mount(
      wrPanel({ title: "Production", body: html`<p>Body</p>`, chamfer: true }),
    );
    const panel = host.querySelector("section.wr-panel");
    expect(panel?.classList.contains("wr-chamfer")).toBe(true);
    expect(host.querySelector(".wr-panel-header")?.textContent).toContain(
      "Production",
    );
    expect(host.querySelector(".p-3")?.textContent).toContain("Body");
    host.remove();
  });

  it("omits the chamfer class unless asked for", () => {
    const host = mount(wrPanel({ title: "Plain", body: html`<p>Body</p>` }));
    expect(
      host.querySelector("section")?.classList.contains("wr-chamfer"),
    ).toBe(false);
    host.remove();
  });

  it("fires onClick for an enabled button", () => {
    const onClick = vi.fn();
    const host = mount(wrButton({ label: "Confirm", onClick }));
    const button = host.querySelector("button") as HTMLButtonElement;
    expect(button.textContent?.trim()).toBe("Confirm");
    button.click();
    expect(onClick).toHaveBeenCalledTimes(1);
    host.remove();
  });

  it("does not fire onClick for a disabled button", () => {
    const onClick = vi.fn();
    const host = mount(wrButton({ label: "Locked", onClick, disabled: true }));
    const button = host.querySelector("button") as HTMLButtonElement;
    expect(button.disabled).toBe(true);
    button.click();
    expect(onClick).not.toHaveBeenCalled();
    host.remove();
  });

  it("applies the primary and alert variant classes", () => {
    const host = mount(wrButton({ label: "Declare war", variant: "alert" }));
    expect(
      host.querySelector("button")?.classList.contains("wr-btn--alert"),
    ).toBe(true);
    host.remove();
  });

  it("renders a stat with a tabular value, a unit and an alert tone", () => {
    const host = mount(
      wrStat({ label: "Manpower", value: "1,240", unit: "k", alert: true }),
    );
    expect(host.querySelector(".wr-label")?.textContent).toBe("Manpower");
    expect(host.querySelector(".wr-stat-value")?.textContent).toBe("1,240");
    expect(host.querySelector(".wr-stat-unit")?.textContent).toBe("k");
    expect(
      host.querySelector(".wr-stat")?.classList.contains("wr-stat--alert"),
    ).toBe(true);
    host.remove();
  });

  it("marks the selected tab and reports the chosen id", () => {
    const onSelect = vi.fn();
    const host = mount(
      wrTabs({
        label: "Views",
        tabs: [
          { id: "map", label: "Map" },
          { id: "army", label: "Army" },
        ],
        selected: "map",
        onSelect,
      }),
    );
    const tabs = Array.from(
      host.querySelectorAll<HTMLButtonElement>('[role="tab"]'),
    );
    expect(tabs[0].getAttribute("aria-selected")).toBe("true");
    expect(tabs[1].getAttribute("aria-selected")).toBe("false");
    tabs[1].click();
    expect(onSelect).toHaveBeenCalledWith("army");
    host.remove();
  });
});
