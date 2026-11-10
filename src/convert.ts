import { BannergressBanner } from "./types/bannergress";
import { UMMissionSet } from "./types/umm";

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

export function convertToUMM(banner: BannergressBanner): UMMissionSet {
  const missions = Object.values(banner.missions);
  return {
    missionSetName: banner.title,
    missionSetDescription: banner.description,
    currentMission: 0,
    plannedBannerLength: banner.numberOfMissions.toString(),
    titleFormat: "T (N/M)",
    fileFormatVersion: 2,
    missions: missions.map((mission) => ({
      missionTitle: mission.title,
      missionDescription: banner.description,
      portals: mission.steps.map((step) => ({
        description: "",
        guid: step.poi.id,
        imageUrl: step.poi.picture,
        isOrnamented: false,
        isStartPoint: false,
        location: {
          latitude: step.poi.latitude,
          longitude: step.poi.longitude,
        },
        title: step.poi.title,
        type: "PORTAL" as "PORTAL",
        objective: {
          type: mapObjective(step.objective),
        },
      })),
    })),
  };
}

export function convertToUMMReversed(banner: BannergressBanner): UMMissionSet {
  const missions = Object.values(banner.missions).reverse();
  return {
    missionSetName: banner.title,
    missionSetDescription: banner.description,
    currentMission: 0,
    plannedBannerLength: banner.numberOfMissions.toString(),
    titleFormat: "T (N/M)",
    fileFormatVersion: 2,
    missions: missions.map((mission) => ({
      missionTitle: mission.title,
      missionDescription: banner.description,
      portals: mission.steps.map((step) => ({
        description: "",
        guid: step.poi.id,
        imageUrl: step.poi.picture,
        isOrnamented: false,
        isStartPoint: false,
        location: {
          latitude: step.poi.latitude,
          longitude: step.poi.longitude,
        },
        title: step.poi.title,
        type: "PORTAL" as "PORTAL",
        objective: {
          type: mapObjective(step.objective),
        },
      })).reverse(),
    })),
  };
}
