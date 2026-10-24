import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  const channels: string[] = [];
  return { channels, remove: vi.fn(), user: { id: "test-user" } };
});
vi.mock("../useAuth", () => ({ useAuth: () => ({ user: mocks.user }) }));
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: () => ({ select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: { plan: "owner", is_active: true } }) }) }) }),
    channel: (name: string) => {
      if (mocks.channels.includes(name)) throw new Error("Channel already subscribed");
      mocks.channels.push(name);
      const channel = { on: () => channel, subscribe: () => channel };
      return channel;
    },
    removeChannel: mocks.remove,
  },
}));
import { usePremium } from "../usePremium";

describe("shared premium subscription", () => {
  it("multiple mounted tools do not reuse a subscribed channel or crash", async () => {
    const first = renderHook(() => usePremium());
    const second = renderHook(() => usePremium());
    await waitFor(() => expect(first.result.current.isPremium).toBe(true));
    expect(second.result.current.isPremium).toBe(true);
    expect(new Set(mocks.channels).size).toBe(2);
    first.unmount(); second.unmount();
    expect(mocks.remove).toHaveBeenCalledTimes(2);
  });
});