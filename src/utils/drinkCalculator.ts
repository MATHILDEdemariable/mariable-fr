
import { DrinkTier, DrinkPrice } from '@/types/drinks';

const BASE_PRICES: DrinkPrice = {
  champagne: 15,
  wine: 7,
  spirits: 20,
};

const TIER_MULTIPLIERS: Record<DrinkTier, number> = {
  economic: 1,
  affordable: 1.5,
  premium: 2.3,
  luxury: 3.3,
};

const DRINKS_PER_BOTTLE = {
  champagne: 6,
  wine: 5,
  spirits: 18,
};

export const calculateBottles = (guests: number, drinksPerPerson: number, drinkType: keyof typeof DRINKS_PER_BOTTLE) => {
  const totalDrinks = guests * drinksPerPerson;
  return Math.ceil(totalDrinks / DRINKS_PER_BOTTLE[drinkType]);
};

export const calculatePrice = (bottles: number, drinkType: keyof DrinkPrice, tier: DrinkTier) => {
  const basePrice = BASE_PRICES[drinkType];
  const multiplier = TIER_MULTIPLIERS[tier];
  return bottles * basePrice * multiplier;
};
