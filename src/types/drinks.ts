
export type DrinkMoment = 'cocktail' | 'dinner' | 'dessert' | 'party';

export type DrinkTier = 'economic' | 'affordable' | 'premium' | 'luxury';

export type DrinkType = 'champagne' | 'wine' | 'spirits';

export interface DrinkPrice {
  champagne: number;
  wine: number;
  spirits: number;
}

export interface DrinkConsumption {
  cocktail: number;
  dinner: number;
  dessert: number;
  party: number;
}
