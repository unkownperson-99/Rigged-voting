/**
 * War-room building blocks as Lit template helpers. They return markup styled
 * by src/client/styles/war-room/components.css, so they work inside the
 * app's light-DOM components: a Lit child can go straight into the body.
 */
import { html, nothing, TemplateResult } from "lit";

/** A hairline panel with a header bar. `body` takes any template. */
export function wrPanel(opts: {
  title: string;
  body: TemplateResult | typeof nothing;
  actions?: TemplateResult | typeof nothing;
  chamfer?: boolean;
  className?: string;
}): TemplateResult {
  return html`
    <section
      class="wr-panel ${opts.chamfer ? "wr-chamfer" : ""} ${opts.className ?? ""}"
    >
      <header class="wr-panel-header">
        <span>${opts.title}</span>
        ${opts.actions ?? nothing}
      </header>
      <div class="p-3">${opts.body}</div>
    </section>
  `;
}

export type WrButtonVariant = "default" | "primary" | "alert";

/** An engraved button. Disabled buttons never react to hover or click. */
export function wrButton(opts: {
  label: string;
  onClick?: (e: Event) => void;
  variant?: WrButtonVariant;
  disabled?: boolean;
  type?: "button" | "submit";
  title?: string;
}): TemplateResult {
  const variant =
    opts.variant === "primary"
      ? "wr-btn--primary"
      : opts.variant === "alert"
        ? "wr-btn--alert"
        : "";
  return html`
    <button
      type=${opts.type ?? "button"}
      class="wr-btn ${variant}"
      ?disabled=${opts.disabled ?? false}
      title=${opts.title ?? nothing}
      @click=${(e: Event) => {
        if (!opts.disabled) opts.onClick?.(e);
      }}
    >
      ${opts.label}
    </button>
  `;
}

/** A labelled figure: a dim caption and a tabular value with an optional unit. */
export function wrStat(opts: {
  label: string;
  value: string | number;
  unit?: string;
  alert?: boolean;
}): TemplateResult {
  return html`
    <div class="flex flex-col gap-0.5">
      <span class="wr-label">${opts.label}</span>
      <span class="wr-stat ${opts.alert ? "wr-stat--alert" : ""}">
        <span class="wr-stat-value">${opts.value}</span>
        ${opts.unit ? html`<span class="wr-stat-unit">${opts.unit}</span>` : nothing}
      </span>
    </div>
  `;
}

export interface WrTabOption<T extends string> {
  id: T;
  label: string;
}

/** A tab strip. The selected tab has a brass rule; `onSelect` gets the id. */
export function wrTabs<T extends string>(opts: {
  tabs: WrTabOption<T>[];
  selected: T;
  onSelect: (id: T) => void;
  label: string;
}): TemplateResult {
  return html`
    <div class="wr-tabs" role="tablist" aria-label=${opts.label}>
      ${opts.tabs.map(
        (tab) => html`
          <button
            type="button"
            role="tab"
            class="wr-tab"
            aria-selected=${tab.id === opts.selected ? "true" : "false"}
            @click=${() => opts.onSelect(tab.id)}
          >
            ${tab.label}
          </button>
        `,
      )}
    </div>
  `;
}
