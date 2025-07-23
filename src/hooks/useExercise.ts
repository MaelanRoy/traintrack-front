import { useMutation, useQuery } from "@tanstack/react-query";

import { queryClient } from "@/config/api/QueryClient.ts";
import type Exercise from "@/models/Exercise";
import ExerciseService from "@/services/ExerciseService";

export const useExerciseDetail = (id: number) => {
  return useQuery<Exercise, Error>({
    queryKey: ["exercises", id],
    queryFn: (): Promise<Exercise> => ExerciseService.findById(id),
  });
};

export const useExercisesList = () => {
  return useQuery<Exercise[], Error>({
    queryKey: ["exercises"],
    queryFn: (): Promise<Exercise[]> => ExerciseService.findAll(),
  });
};

export const useCreateExercise = () => {
  return useMutation<Exercise, Error, Exercise>({
    mutationFn: (exercise: Exercise): Promise<Exercise> =>
      ExerciseService.create(exercise),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exercises"] });
    },
  });
};

export const useUpdateExercise = () => {
  return useMutation<Exercise, Error, Exercise>({
    mutationFn: (exercise: Exercise): Promise<Exercise> =>
      ExerciseService.update(exercise),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["exercises"] });
      queryClient.invalidateQueries({ queryKey: ["exercise-images", data.id] });
    },
  });
};

export const useDeleteExercise = () => {
  return useMutation({
    mutationFn: (id: number): Promise<void> => ExerciseService.deleteById(id),
    onSuccess: (_, idToDelete) => {
      queryClient.setQueryData(["exercises"], (oldData?: Exercise[]) => {
        return oldData?.filter((game) => game.id !== idToDelete) || [];
      });
      queryClient.invalidateQueries({
        queryKey: ["exercise-images", idToDelete],
      });
    },
  });
};
