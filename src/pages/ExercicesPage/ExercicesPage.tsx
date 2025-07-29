import ExerciseList from "@/_components/ExerciseList/ExerciseList";
import { useRandomExercisesFromAllCategories } from "@/hooks/useExercise";
import { useGroupedExercises } from "@/hooks/useGroupedExercises";

const ExercicesPage = () => {
  const {
    isLoading: isLoadingRandomExercises,
    isError: isErrorRandomExercises,
    isSuccess: isSuccessRandomExercises,
    data: randomExercisesData,
  } = useRandomExercisesFromAllCategories();

  // Utiliser le hook personnalisé pour grouper les exercices
  const exercisesByCategory = useGroupedExercises(randomExercisesData);

  console.log("Random Exercises Data:", randomExercisesData);
  console.log("Exercises by Category:", exercisesByCategory);

  return (
    <>
      {isLoadingRandomExercises && "loading..."}
      {isErrorRandomExercises && "error loading exercise zones"}
      {isSuccessRandomExercises && exercisesByCategory && (
        <ExerciseList exercisesByCategory={exercisesByCategory} />
      )}
    </>
  );
};
export default ExercicesPage;
