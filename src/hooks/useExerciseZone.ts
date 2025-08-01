import type ExerciseZone from "@/models/ExerciseZone";
import ExerciseZoneService from "@/services/ExerciseZoneService";
import { useQuery } from "@tanstack/react-query";

export const useExerciseZoneList = () => {
  return useQuery<ExerciseZone[], Error>({
    queryKey: ["exercise-zones"],
    queryFn: (): Promise<ExerciseZone[]> => ExerciseZoneService.findAll(),
  });
};
