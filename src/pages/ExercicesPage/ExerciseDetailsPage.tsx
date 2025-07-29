import ExerciseDetails from "@/_components/ExerciseDetails/ExerciseDetails";
import { useExerciseDetail } from "@/hooks/useExercise";
import { useExerciseImagesListByExerciseId } from "@/hooks/useExerciseImage";
import { useParams } from "react-router-dom";

const ExerciseDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const {
    isLoading: isLoadingExercise,
    isError: isErrorExercise,
    isSuccess: isSuccessExercise,
    data: dataExercise,
  } = useExerciseDetail(Number(id));

  const { data: imageData } = useExerciseImagesListByExerciseId(Number(id));

  return (
    <>
      {isLoadingExercise && <p>Loading...</p>}
      {isErrorExercise && <p>Error loading exercise details.</p>}
      {isSuccessExercise && dataExercise && (
        <ExerciseDetails exercise={dataExercise} images={imageData} />
      )}
    </>
  );
};
export default ExerciseDetailsPage;
