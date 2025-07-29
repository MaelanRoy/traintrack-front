import ExerciseForm, {
  type ExerciseFormValues,
} from "@/_components/ExerciseForm/ExerciseForm";
import { useCategoryList } from "@/hooks/useCategory";
import { useCreateExercise } from "@/hooks/useExercise";
import { useCreateExerciseImage } from "@/hooks/useExerciseImage";
import { useExerciseZoneList } from "@/hooks/useExerciseZone";
import type Exercise from "@/models/Exercise";

const ExerciseCreationPage = () => {
  const {
    isLoading: isLoadingExerciseZones,
    isError: isErrorExerciseZones,
    isSuccess: isSuccessExerciseZones,
    data: exerciseZonesData,
  } = useExerciseZoneList();

  const {
    isLoading: isLoadingCategories,
    isError: isErrorCategories,
    isSuccess: isSuccessCategories,
    data: exerciseCategoriesData,
  } = useCategoryList();

  console.log("categories", exerciseCategoriesData);

  const { mutateAsync: createExercise } = useCreateExercise();
  const { mutateAsync: createExerciseImage } = useCreateExerciseImage();

  const handleSubmit = async (values: ExerciseFormValues) => {
    const exercice: Exercise = {
      name: values.name,
      description: values.description,
      category: values.category,
      caloriesPerMinute: values.caloriesPerMinute,
      caloriesPerRepetition: values.caloriesPerRepetition,
      defaultDuration: values.defaultDuration,
      defaultRepetitions: values.defaultRepetitions,
      defaultSets: values.defaultSets,
      defaultEquipmentWeight: values.defaultEquipmentWeight,
      zones: values.zones,
    };
    console.log("Exercice à créer :", exercice);

    const createExerciseResponse = await createExercise(exercice);

    // Traitement des images
    if (createExerciseResponse && values.images && values.images.length > 0) {
      for (let i = 0; i < values.images.length; i++) {
        const image = values.images[i];

        try {
          // File hérite de Blob, pas besoin de conversion
          await createExerciseImage({
            exerciseImage: image, // File est compatible avec Blob
            exerciseId: createExerciseResponse.id!,
            position: i + 1,
          });
        } catch (error) {
          console.error("❌ Erreur upload image", i + 1, ":", error);
        }
      }
    } else {
      console.log("⚠️ Aucune image à traiter");
    }
  };

  return (
    <>
      {isLoadingExerciseZones && isLoadingCategories && "loading..."}
      {isErrorExerciseZones &&
        isErrorCategories &&
        "error loading exercise zones"}
      {isSuccessExerciseZones && isSuccessCategories && (
        <ExerciseForm
          onSubmited={handleSubmit}
          exerciseZones={exerciseZonesData}
          categories={exerciseCategoriesData}
        />
      )}
    </>
  );
};
export default ExerciseCreationPage;
