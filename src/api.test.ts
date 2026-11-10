import { afterEach, describe, expect, it, vi } from "vitest";

const fetchMock = vi.fn();

function jsonResponse(body: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { "Content-Type": "application/json" },
    ...init,
  });
}

afterEach(() => {
  fetchMock.mockReset();
  vi.unstubAllGlobals();
});

async function loadApi() {
  vi.resetModules();
  vi.stubGlobal("fetch", fetchMock);
  return import("./api");
}

describe("getBanner", () => {
  it("encodes the banner ID and returns the response body", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ title: "Test Banner" }));

    const { getBanner } = await loadApi();
    const banner = await getBanner("a b");

    expect(banner.title).toBe("Test Banner");
    const url = fetchMock.mock.calls[0]?.[0] as URL;
    expect(url.href).toBe("https://api.bannergress.com/bnrs/a%20b");
  });

  it("throws on non-2xx responses", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ message: "not found" }, { status: 404, statusText: "Not Found" }),
    );

    const { getBanner } = await loadApi();

    await expect(getBanner("missing")).rejects.toThrow("HTTP 404 Not Found");
  });
});

describe("listBanners", () => {
  it("serializes query arrays and the Accept-Language header", async () => {
    fetchMock.mockResolvedValue(jsonResponse([]));

    const { listBanners } = await loadApi();
    await listBanners(
      { listTypes: ["todo", "done"], limit: 2 },
      { acceptLanguage: "en" },
    );

    const url = fetchMock.mock.calls[0]?.[0] as URL;
    const init = fetchMock.mock.calls[0]?.[1] as RequestInit;

    expect(url.pathname).toBe("/bnrs");
    expect(url.searchParams.getAll("listTypes")).toEqual(["todo", "done"]);
    expect(url.searchParams.get("limit")).toBe("2");
    expect(init.headers).toEqual({ "Accept-Language": "en" });
  });
});
