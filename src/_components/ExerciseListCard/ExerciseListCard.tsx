import { useNavigate } from "react-router-dom";
import { useExerciseImagesListByExerciseId } from "@/hooks/useExerciseImage";
import type Exercise from "@/models/Exercise";
import emptyImage from "@/assets/image/emptyImage.png";

export interface ExerciseListCardProps {
  exercise: Exercise;
}

const ExerciseListCard = ({ exercise }: ExerciseListCardProps) => {
  const navigate = useNavigate();
  const { data: imageData } = useExerciseImagesListByExerciseId(exercise.id!);

  const imageSrc =
    imageData && imageData[0]
      ? `data:${imageData[0].imageType};base64,${imageData[0].imageData}`
      : emptyImage;

  const handleClick = () => {
    navigate(`/exercises/${exercise.id}`);
  };

  return (
    <div
      className="relative w-40 h-40 rounded-2xl overflow-hidden cursor-pointer group"
      onClick={handleClick}
    >
      <img
        className="w-full h-full object-cover"
        src={imageSrc}
        alt={exercise.name}
      />
      <div className="absolute bottom-0 left-0 w-full h-3/4 bg-gradient-to-tr from-black/80 via-white/0 to-transparent pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-full h-3/4 bg-gradient-to-tr from-accent/80 via-white/0 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"></div>
      <p className="absolute bottom-2 ml-2 text-xl font-semibold text-white">
        {exercise.name}
      </p>
    </div>
  );
};

export default ExerciseListCard;
