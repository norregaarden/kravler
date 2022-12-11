type Band = string;

type Koncert = {
  bands: Band[];
  href: string;
  day: number;
  price: number;
};

type FrydfulMaaned = {
  month: string;
  events: Koncert[];
};

export type { Band, Koncert, FrydfulMaaned };
