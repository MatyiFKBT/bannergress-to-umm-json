export interface BannergressBanner {
  id: string;
  title: string;
  description: string;
  width: number;
  numberOfMissions: number;
  missions: {
    [key: string]: BannergressMission;
  };
}

export interface BannergressMission {
  id: string;
  title: string;
  picture: string;
  steps: BannergressStep[];
}

export interface BannergressStep {
  poi: BannergressPOI;
  objective: string;
}

export interface BannergressPOI {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
  picture: string;
  type: "portal";
}
