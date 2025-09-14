export interface UMMissionSet {
  missionSetName: string;
  missionSetDescription: string;
  currentMission: number;
  plannedBannerLength: string;
  titleFormat: string;
  fileFormatVersion: number;
  missions: UMMission[];
}

export interface UMMission {
  missionTitle: string;
  missionDescription: string;
  portals: UMPortal[];
}

export interface UMPortal {
  description: string;
  guid: string;
  imageUrl: string;
  isOrnamented: boolean;
  isStartPoint: boolean;
  location: {
    latitude: number;
    longitude: number;
  };
  title: string;
  type: "PORTAL";
  objective: {
    type: string;
    passphrase_params?: {
      question: string;
      _single_passphrase?: string;
    };
  };
}
