import { useMemo } from "react";
import type Category from "@/models/Category";
import type Exercise from "@/models/Exercise";
import ExerciseListCard from "../ExerciseListCard/ExerciseListCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export type ExerciseListProps = {
  exercisesByCategory:
    | Record<string, { category: Category; exercises: Exercise[] }>
    | undefined;
};

// Types pour améliorer la lisibilité
type OrganizedCategory = {
  categoryName: string;
  exercises: Exercise[];
  size: number;
};

type CategoryEntry = [string, { category: Category; exercises: Exercise[] }];

// Fonction utilitaire extraite pour de meilleures performances
const getOptimalSize = (
  exerciseCount: number,
  remainingSpace: number
): number => {
  if (exerciseCount >= 8 && remainingSpace >= 4) return 4;
  if (exerciseCount >= 6 && remainingSpace >= 3) return 3;
  if (exerciseCount >= 3 && remainingSpace >= 2) return 2;
  return Math.min(remainingSpace, 1);
};

// Classes CSS pré-définies pour éviter la création de strings dynamiques
const COL_SPAN_CLASSES = {
  1: "col-span-1",
  2: "col-span-2",
  3: "col-span-3",
  4: "col-span-4",
  5: "col-span-5",
  6: "col-span-6",
} as const;

const ExerciseList = ({ exercisesByCategory }: ExerciseListProps) => {
  // Algorithme de placement par espace restant avec alternance
  const organizeByRemainingSpace = (categories: CategoryEntry[]) => {
    const organized: OrganizedCategory[] = [];
    let currentRowUsed = 0;
    const maxCols = 6;

    // Grouper les catégories par ligne d'abord
    const rows: OrganizedCategory[][] = [];
    let currentRow: OrganizedCategory[] = [];

    for (const [categoryName, { exercises }] of categories) {
      const remainingInRow = maxCols - currentRowUsed;
      const optimalSize = getOptimalSize(exercises.length, remainingInRow);

      // Si ça ne rentre pas dans la ligne actuelle, passer à la suivante
      if (optimalSize > remainingInRow && currentRow.length > 0) {
        rows.push(currentRow);
        currentRow = [];
        currentRowUsed = 0;
      }

      const finalSize = Math.min(optimalSize, maxCols - currentRowUsed);
      currentRowUsed += finalSize;

      currentRow.push({
        categoryName,
        exercises,
        size: finalSize,
      });

      // Si la ligne est complète, l'ajouter aux lignes
      if (currentRowUsed >= maxCols) {
        rows.push(currentRow);
        currentRow = [];
        currentRowUsed = 0;
      }
    }

    // Ajouter la dernière ligne si elle n'est pas vide
    if (currentRow.length > 0) {
      rows.push(currentRow);
    }

    // Inverser l'ordre des catégories dans les lignes paires (effet zigzag)
    rows.forEach((row, index) => {
      if (index % 2 === 1) {
        // Lignes impaires (index 1, 3, 5...) : inverser l'ordre
        organized.push(...row.reverse());
      } else {
        // Lignes paires (index 0, 2, 4...) : ordre normal
        organized.push(...row);
      }
    });

    return organized;
  };

  // Mémorisation du tri et de l'organisation pour éviter les recalculs
  const organizedCategories = useMemo(() => {
    if (!exercisesByCategory) return [];

    const sortedEntries = Object.entries(exercisesByCategory).sort(
      ([, a], [, b]) => b.exercises.length - a.exercises.length
    );

    return organizeByRemainingSpace(sortedEntries);
  }, [exercisesByCategory]);

  return (
    <div>
      <div className="grid grid-cols-6 gap-5 auto-rows-min">
        {organizedCategories.map(({ categoryName, exercises, size }) => {
          const bentoSize =
            COL_SPAN_CLASSES[size as keyof typeof COL_SPAN_CLASSES];

          return (
            <div key={categoryName} className={bentoSize}>
              <h1 className="text-xl font-semibold text-accent mb-3 truncate">
                {categoryName}
                {/* {categoryName} ({exercises.length} exercices) */}
              </h1>

              <div className="bg-primary rounded-xl p-5  min-h-[200px] flex items-center">
                <Carousel
                  opts={{
                    loop: true,
                  }}
                  className="w-full"
                >
                  <CarouselContent className="-ml-5">
                    {exercises.map((exercise) => (
                      <CarouselItem
                        className="pl-5 flex-none"
                        key={exercise.id}
                      >
                        <ExerciseListCard exercise={exercise} />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-2 h-6 w-6" />
                  <CarouselNext className="right-2 h-6 w-6" />
                </Carousel>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ExerciseList;
