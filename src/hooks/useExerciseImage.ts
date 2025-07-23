import { useMutation, useQuery } from "@tanstack/react-query";

import { queryClient } from "@/config/api/QueryClient.ts";
import type ExerciseImage from "@/models/ExerciseImage";
import ExerciseImageService from "@/services/ExerciseImageService";

export const useCreateExerciseImage = () => {
  return useMutation<
    ExerciseImage,
    Error,
    { exerciseImage: Blob; exerciseId: number; position: number }
  >({
    mutationFn: ({
      exerciseImage,
      exerciseId,
      position,
    }): Promise<ExerciseImage> =>
      ExerciseImageService.create(exerciseImage, exerciseId, position),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exercise-images"] });
    },
  });
};

export const useExerciseImagesListByExerciseId = (id: number) => {
  return useQuery<ExerciseImage[], Error>({
    queryKey: ["exercise-images", id],
    queryFn: (): Promise<ExerciseImage[]> =>
      ExerciseImageService.findByExerciseId(id),
  });
};

export const useUpdateExerciseImage = () => {
  return useMutation<
    ExerciseImage,
    Error,
    { id: number; exerciseImage: Blob; exerciseId: number }
  >({
    mutationFn: ({ id, exerciseImage, exerciseId }): Promise<ExerciseImage> =>
      ExerciseImageService.update(id, exerciseImage, exerciseId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["exercise-images"] });
      queryClient.invalidateQueries({ queryKey: ["exercise-images", data.id] });
    },
  });
};

export const useDeleteImage = () => {
  return useMutation({
    mutationFn: (id: number): Promise<void> =>
      ExerciseImageService.deleteById(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["exercise-images"] });
      queryClient.invalidateQueries({ queryKey: ["exercise-images", id] });
    },
  });
};
