export interface charaType {
  name: string;
  type: string;
  hasRarity6: boolean;
  hasSpecialBase?: boolean;
}

export type charactersType = {
  [code: number]: charaType;
};

export interface UnitState {
  baseId: string;
  weaponType: string;
  animation: string;
  animationSpeed: string;
}
