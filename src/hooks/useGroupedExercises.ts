import { useMemo } from "react";
import type Exercise from "@/models/Exercise";
import type Category from "@/models/Category";

export const useGroupedExercises = (exercises: Exercise[] | undefined) => {
  return useMemo(() => {
    if (!exercises) return undefined;

    return exercises.reduce((acc, exercise) => {
      const categoryName = exercise.category.name;
      if (!acc[categoryName]) {
        acc[categoryName] = {
          category: exercise.category,
          exercises: [],
        };
      }
      acc[categoryName].exercises.push(exercise);
      return acc;
    }, {} as Record<string, { category: Category; exercises: Exercise[] }>);
  }, [exercises]);
};
