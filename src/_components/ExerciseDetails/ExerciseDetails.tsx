import { useState } from "react";
import type Exercise from "@/models/Exercise";
import type ExerciseImage from "@/models/ExerciseImage";
import emptyImage from "@/assets/image/emptyImage.png";
import Counter from "../Counter/Counter";
import { BsThreeDotsVertical } from "react-icons/bs";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FaTrash, FaPen } from "react-icons/fa";

export interface ExerciseDetailsProps {
  exercise: Exercise;
  images: ExerciseImage[] | undefined;
}

const ExerciseDetails = ({ exercise, images }: ExerciseDetailsProps) => {
  const { isAdmin } = useAuth();

  const [setCount, setSetCount] = useState(exercise.defaultSets || 1);
  const [duration, setDuration] = useState(
    (exercise.defaultDuration || 0) * 60
  ); // convertir minutes en secondes
  const [repetitions, setRepetitions] = useState(
    exercise.defaultRepetitions || 1
  );
  const [equipmentWeight, setEquipmentWeight] = useState(
    exercise.defaultEquipmentWeight || 0
  );

  const carouselImages =
    images && images[0]
      ? images.map(
          (image) => `data:${image.imageType};base64,${image.imageData}`
        )
      : [emptyImage];

  const handleDecrease = () => {
    setSetCount((prev: number) => Math.max(1, prev - 1));
  };

  const handleIncrease = () => {
    setSetCount((prev: number) => prev + 1);
  };

  const handleDurationDecrease = () => {
    setDuration((prev: number) => Math.max(0, prev - 5));
  };

  const handleDurationIncrease = () => {
    setDuration((prev: number) => prev + 5);
  };

  const handleRepetitionsDecrease = () => {
    setRepetitions((prev: number) => Math.max(1, prev - 1));
  };

  const handleRepetitionsIncrease = () => {
    setRepetitions((prev: number) => prev + 1);
  };

  const handleEquipmentWeightDecrease = () => {
    setEquipmentWeight((prev: number) => Math.max(0, prev - 0.5));
  };

  const handleEquipmentWeightIncrease = () => {
    setEquipmentWeight((prev: number) => prev + 0.5);
  };

  const formatDuration = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-row items-center">
        <h1 className="text-2xl font-semibold text-accent">{exercise.name}</h1>
        <div className="flex flex-col gap-4"></div>
        <DropdownMenu>
          {isAdmin && (
            <DropdownMenuTrigger>
              <BsThreeDotsVertical className="w-6 h-6 cursor-pointer" />
            </DropdownMenuTrigger>
          )}
          <DropdownMenuContent>
            <DropdownMenuItem>
              <FaPen className="" />
              Modifier
            </DropdownMenuItem>
            <DropdownMenuItem>
              <FaTrash className="" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex flex-row gap-5">
        <div className="bg-primary rounded-2xl overflow-hidden">
          <Carousel className="w-96 h-96" opts={{ loop: true }}>
            <CarouselContent>
              {carouselImages.map((src, index) => (
                <CarouselItem key={index}>
                  <img src={src} alt={`Exercise Image ${index + 1}`} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2 h-6 w-6" />
            <CarouselNext className="right-2 h-6 w-6" />
          </Carousel>
        </div>
        <div className="flex flex-col gap-5 w-[600px]">
          <h2 className="text-xl text-accent font-extrabold">INSTRUCTION</h2>
          <p>{exercise.description}</p>
          <h2 className="text-xl text-accent font-extrabold">ZONES CIBLÉES</h2>
          <div className="flex flex-wrap gap-3">
            {exercise.zones.map((zone, index) => (
              <span
                className="px-4 py-2 rounded-2xl bg-primary inline-block"
                key={index}
              >
                {zone.name}
              </span>
            ))}
          </div>
          <div className="flex flex-row gap-5">
            <div className="flex flex-col gap-5">
              <h2 className="text-xl text-accent font-extrabold">SÉRIES</h2>
              <Counter
                value={setCount}
                onDecrease={handleDecrease}
                onIncrease={handleIncrease}
              />
            </div>

            {exercise.defaultDuration && (
              <div className="flex flex-col gap-5">
                <h2 className="text-xl text-accent font-extrabold">DURÉE</h2>
                <Counter
                  value={formatDuration(duration)}
                  onDecrease={handleDurationDecrease}
                  onIncrease={handleDurationIncrease}
                  className="text-2xl font-semibold min-w-[4rem] text-center font-mono"
                />
              </div>
            )}

            {exercise.defaultRepetitions && (
              <div className="flex flex-col gap-5">
                <h2 className="text-xl text-accent font-extrabold">
                  RÉPÉTITIONS
                </h2>
                <Counter
                  value={repetitions}
                  onDecrease={handleRepetitionsDecrease}
                  onIncrease={handleRepetitionsIncrease}
                />
              </div>
            )}

            {exercise.defaultEquipmentWeight > 0 && (
              <div className="flex flex-col gap-5">
                <h2 className="text-xl text-accent font-extrabold">
                  POIDS (KG)
                </h2>
                <Counter
                  value={equipmentWeight}
                  onDecrease={handleEquipmentWeightDecrease}
                  onIncrease={handleEquipmentWeightIncrease}
                  className="text-2xl font-semibold min-w-[4rem] text-center"
                  unit="kg"
                />
              </div>
            )}
          </div>
          <div className="flex flex-row gap-3">
            <Button variant="default">Enregistrer</Button>
            <Button variant="default">Programmer</Button>
            <Button variant="default">Ajouter à un programme</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseDetails;
