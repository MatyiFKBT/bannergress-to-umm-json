import type { BannerDto } from "bannergress-api";
import { describe, expect, it } from "vitest";
import { convertToUMM, convertToUMMReversed, mapObjective } from "./convert";

const banner: BannerDto = {
  id: "banner-id",
  title: "Test Banner",
  description: "Test description",
  width: 2,
  numberOfMissions: 2,
  type: "sequential",
  missions: {
    first: {
      id: "mission-1",
      title: "First Mission",
      picture: "https://example.com/mission-1.png",
      steps: [
        {
          poi: {
            id: "portal-1",
            title: "Portal One",
            latitude: 1,
            longitude: 2,
            picture: "https://example.com/portal-1.png",
            type: "portal",
          },
          objective: "hack",
        },
      ],
    },
    second: {
      id: "mission-2",
      title: "Second Mission",
      picture: "https://example.com/mission-2.png",
      steps: [
        {
          poi: {
            id: "portal-2",
            title: "Portal Two",
            latitude: 3,
            longitude: 4,
            picture: "https://example.com/portal-2.png",
            type: "portal",
          },
          objective: "captureOrUpgrade",
        },
      ],
    },
  },
};

describe("convertToUMM", () => {
  it("converts banner metadata and missions", () => {
    const result = convertToUMM(banner);

    expect(result.missionSetName).toBe("Test Banner");
    expect(result.plannedBannerLength).toBe("2");
    expect(result.missions).toHaveLength(2);
    expect(result.missions[0].missionTitle).toBe("First Mission");
    expect(result.missions[0].portals[0]).toMatchObject({
      guid: "portal-1",
      title: "Portal One",
      type: "PORTAL",
      location: { latitude: 1, longitude: 2 },
      objective: { type: "HACK_PORTAL" },
    });
  });

  it("reverses mission and portal order", () => {
    const result = convertToUMMReversed(banner);

    expect(result.missions.map((mission) => mission.missionTitle)).toEqual([
      "Second Mission",
      "First Mission",
    ]);
    expect(result.missions[0].portals.map((portal) => portal.guid)).toEqual([
      "portal-2",
    ]);
  });
});

describe("mapObjective", () => {
  it("maps known objectives", () => {
    expect(mapObjective("hack")).toBe("HACK_PORTAL");
    expect(mapObjective("createField")).toBe("CREATE_FIELD");
  });

  it("falls back for unknown objectives", () => {
    expect(mapObjective("somethingElse")).toBe("UNKNOWN (somethingElse)");
  });
});
