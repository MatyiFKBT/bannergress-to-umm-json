import type { components, operations } from "./bannergress-schema";

export type BannerDto = components["schemas"]["BannerDto"];
export type MissionDto = components["schemas"]["MissionDto"];
export type MissionStepDto = components["schemas"]["MissionStepDto"];
export type PoiDto = components["schemas"]["PoiDto"];
export type NamedAgentDto = components["schemas"]["NamedAgentDto"];
export type BannerListType = components["schemas"]["BannerListType"];
export type BannerSortOrder = components["schemas"]["BannerSortOrder"];
export type Faction = components["schemas"]["Faction"];
export type Objective = components["schemas"]["Objective"];
export type POIType = components["schemas"]["POIType"];

export type ListBannersParams = NonNullable<
  operations["list"]["parameters"]["query"]
>;

export interface ListBannersOptions {
  acceptLanguage?: string;
}

const API_BASE = "https://api.bannergress.com";

async function request<T>(
  path: string,
  query?: URLSearchParams,
  headers?: HeadersInit,
): Promise<T> {
  const url = new URL(path, API_BASE);
  const search = query?.toString();
  if (search) {
    url.search = search;
  }

  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${response.statusText}`);
  }

  return (await response.json()) as T;
}

export function getBanner(id: string): Promise<BannerDto> {
  return request(`/bnrs/${encodeURIComponent(id)}`);
}

export function listBanners(
  params: ListBannersParams = {},
  options: ListBannersOptions = {},
): Promise<BannerDto[]> {
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) {
      continue;
    }

    if (Array.isArray(value)) {
      for (const item of value) {
        query.append(key, String(item));
      }
    } else {
      query.set(key, String(value));
    }
  }

  const headers = options.acceptLanguage
    ? { "Accept-Language": options.acceptLanguage }
    : undefined;

  return request("/bnrs", query, headers);
}
