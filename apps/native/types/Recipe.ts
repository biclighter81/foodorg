export type Recipe = {
  name: string;
  ingredients: {
    name: string;
    amount: string;
    unit: string;
  }[];
  method: {
    title: string;
    description: string;
  }[];
};
