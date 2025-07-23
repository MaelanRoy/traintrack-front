import type Category from "./Category";
import type ExerciseZone from "./ExerciseZone";

export default interface Exercise {
  id?: number;
  name: string;
  description: string;
  category: Category;
  caloriesPerMinute?: number;
  caloriesPerRepetition?: number;
  defaultDuration?: number;
  defaultRepetitions?: number;
  defaultSets: number;
  defaultEquipmentWeight: number;
  zones: Array<ExerciseZone>;
}
