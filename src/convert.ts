import type { BannerDto, MissionDto, MissionStepDto, PoiDto } from "bannergress-api";
import type { UMMission, UMMissionSet, UMPortal } from "./types/umm";

export function mapObjective(objective: string): string {
  switch (objective) {
    case "hack":
      return "HACK_PORTAL";
    case "captureOrUpgrade":
      return "CAPTURE_PORTAL";
    case "createLink":
      return "CREATE_LINK";
    case "createField":
      return "CREATE_FIELD";
    case "installMod":
      return "INSTALL_MOD";
    case "takePhoto":
      return "TAKE_PICTURE";
    case "viewWaypoint":
      return "VIEW_WAYPOINT";
    case "enterPassphrase":
      return "ENTER_PASSPHRASE";
    default:
      return `UNKNOWN (${objective})`;
  }
}

function getPoi(step: MissionStepDto): PoiDto {
  if (!step.poi) {
    throw new Error("Mission step is missing its POI");
  }

  return step.poi;
}

function toPortal(step: MissionStepDto): UMPortal {
  const poi = getPoi(step);

  return {
    description: "",
    guid: poi.id ?? "",
    imageUrl: poi.picture,
    isOrnamented: false,
    isStartPoint: false,
    location: {
      latitude: poi.latitude ?? 0,
      longitude: poi.longitude ?? 0,
    },
    title: poi.title,
    type: "PORTAL",
    objective: {
      type: mapObjective(step.objective ?? "unknown"),
    },
  };
}

function toMission(mission: MissionDto, description: string, reversed: boolean): UMMission {
  const steps = mission.steps ?? [];

  return {
    missionTitle: mission.title ?? "",
    missionDescription: description,
    portals: (reversed ? [...steps].reverse() : steps).map(toPortal),
  };
}

function convert(banner: BannerDto, reversed: boolean): UMMissionSet {
  const missions = Object.values(banner.missions ?? {});
  const orderedMissions = reversed ? [...missions].reverse() : missions;
  const description = banner.description ?? "";

  return {
    missionSetName: banner.title,
    missionSetDescription: description,
    currentMission: 0,
    plannedBannerLength: (banner.numberOfMissions ?? missions.length).toString(),
    titleFormat: "T (N/M)",
    fileFormatVersion: 2,
    missions: orderedMissions.map((mission) => toMission(mission, description, reversed)),
  };
}

export function convertToUMM(banner: BannerDto): UMMissionSet {
  return convert(banner, false);
}

export function convertToUMMReversed(banner: BannerDto): UMMissionSet {
  return convert(banner, true);
}
