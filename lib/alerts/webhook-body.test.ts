import { describe, expect, it } from "vitest";

import { buildWebhookBody } from "@/lib/alerts/webhook-body";

describe("buildWebhookBody", () => {
  it("wraps Slack webhooks with text", () => {
    const body = buildWebhookBody(
      "https://hooks.slack.com/services/T/B/x",
      "hello",
      { event: "test" },
    );
    expect(body).toEqual({ text: "hello" });
  });

  it("wraps Discord webhooks with content", () => {
    const body = buildWebhookBody(
      "https://discord.com/api/webhooks/123/abc",
      "hello",
      { event: "test" },
    );
    expect(body).toEqual({ content: "hello" });
  });

  it("keeps raw payload for generic webhooks", () => {
    const raw = { event: "test", value: 1 };
    expect(
      buildWebhookBody("https://example.com/hook", "ignored", raw),
    ).toEqual(raw);
  });
});
