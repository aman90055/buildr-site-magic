import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

const invokeMock = vi.fn();
vi.mock("@/integrations/supabase/client", () => ({
  supabase: { functions: { invoke: (...args: any[]) => invokeMock(...args) } },
}));

const toastMock = vi.fn();
vi.mock("@/hooks/use-toast", () => ({ useToast: () => ({ toast: toastMock }) }));

// Skip heavy header/footer rendering for the unit test
vi.mock("@/components/Header", () => ({ default: () => null }));
vi.mock("@/components/Footer", () => ({ default: () => null }));

import Contact from "@/pages/Contact";

const renderContact = () =>
  render(
    <HelmetProvider>
      <MemoryRouter><Contact /></MemoryRouter>
    </HelmetProvider>
  );

const fillForm = () => {
  fireEvent.change(screen.getByLabelText(/your name/i), { target: { value: "Test User" } });
  fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: "test@example.com" } });
  fireEvent.change(screen.getByLabelText(/subject/i), { target: { value: "Hello" } });
  fireEvent.change(screen.getByLabelText(/message/i), {
    target: { value: "This is a sufficiently long test message body." },
  });
};

describe("Contact form — RESEND_API_KEY handling", () => {
  beforeEach(() => {
    invokeMock.mockReset();
    toastMock.mockReset();
  });

  it("shows destructive toast when the edge function reports the email is queued (key missing/invalid)", async () => {
    invokeMock.mockResolvedValue({
      data: { success: true, queued: true, message: "Your message was saved, but email delivery needs a valid mail API key." },
      error: null,
    });

    renderContact();
    fillForm();
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => expect(invokeMock).toHaveBeenCalledWith("send-contact-email", expect.any(Object)));
    await waitFor(() => expect(toastMock).toHaveBeenCalled());

    const call = toastMock.mock.calls.find((c) => c[0]?.variant === "destructive");
    expect(call).toBeTruthy();
    expect(call[0].title).toMatch(/email delivery unavailable/i);
    expect(call[0].description).toMatch(/saved|API key/i);
  });

  it("shows success toast when the email is sent normally", async () => {
    invokeMock.mockResolvedValue({
      data: { success: true, message: "Email sent successfully" },
      error: null,
    });

    renderContact();
    fillForm();
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => expect(toastMock).toHaveBeenCalled());
    const successCall = toastMock.mock.calls.find((c) => /message sent/i.test(c[0]?.title || ""));
    expect(successCall).toBeTruthy();
    expect(successCall[0].variant).toBeUndefined();
  });

  it("still calls the save endpoint even when delivery is queued (message persisted)", async () => {
    invokeMock.mockResolvedValue({
      data: { success: true, queued: true, message: "saved" },
      error: null,
    });
    renderContact();
    fillForm();
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));
    await waitFor(() => expect(invokeMock).toHaveBeenCalledTimes(1));
    // The form posts to send-contact-email which always inserts before attempting to send.
    expect(invokeMock).toHaveBeenCalledWith(
      "send-contact-email",
      expect.objectContaining({
        body: expect.objectContaining({
          name: "Test User",
          email: "test@example.com",
          subject: "Hello",
        }),
      })
    );
  });
});
