import type Category from "@/models/Category";
import type ExerciseZone from "@/models/ExerciseZone";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import FormInput from "@/_components/FormInput";
import { ScrollArea } from "@/components/ui/scroll-area";

export type ExerciseFormValues = {
  name: string;
  description: string;
  category: Category;
  exerciseType: "duration" | "repetition";
  caloriesPerMinute?: number;
  caloriesPerRepetition?: number;
  defaultDuration?: number;
  defaultRepetitions?: number;
  defaultSets: number;
  defaultEquipmentWeight: number;
  zones: ExerciseZone[];
  images: File[];
};

export type ExerciseFormProps = {
  onSubmited: (values: ExerciseFormValues) => void;
  exerciseZones: ExerciseZone[];
  categories: Category[];
  initialValues?: ExerciseFormValues;
};

const ExerciseForm = (exerciseFormProps: ExerciseFormProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    clearErrors,
    reset,
  } = useForm<ExerciseFormValues>({
    mode: "onSubmit", // Valide uniquement à la soumission
    defaultValues: {
      name: "",
      description: "",
      category: undefined,
      exerciseType: "duration",
      caloriesPerMinute: undefined,
      caloriesPerRepetition: undefined,
      defaultDuration: undefined,
      defaultRepetitions: undefined,
      defaultSets: 0,
      defaultEquipmentWeight: 0,
      zones: [],
      images: [],
      ...exerciseFormProps.initialValues,
    },
  });

  const exerciseType = watch("exerciseType");

  const onSubmit = (data: ExerciseFormValues) => {
    exerciseFormProps.onSubmited(data);
    // Reset avec suppression des erreurs
    reset({
      name: "",
      description: "",
      category: undefined,
      exerciseType: "duration",
      caloriesPerMinute: undefined,
      caloriesPerRepetition: undefined,
      defaultDuration: undefined,
      defaultRepetitions: undefined,
      defaultSets: 0,
      defaultEquipmentWeight: 0,
      zones: [],
      images: [],
    });
  };

  const onCancel = () => {
    if (exerciseFormProps.initialValues) {
      reset({
        ...exerciseFormProps.initialValues,
      });
    } else {
      reset({
        name: "",
        description: "",
        category: undefined,
        exerciseType: "duration",
        caloriesPerMinute: undefined,
        caloriesPerRepetition: undefined,
        defaultDuration: undefined,
        defaultRepetitions: undefined,
        defaultSets: 0,
        defaultEquipmentWeight: 0,
        zones: [],
        images: [],
      });
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-semibold text-accent">
          {exerciseFormProps.initialValues
            ? "Modification de l'exercice"
            : "Ajouter un exercice"}
        </h1>
      </div>
      <div className="flex flex-row gap-5 justify-center">
        <div className="w-[470px]">
          {/* Upload d'images */}
          <FormInput
            name="images"
            control={control}
            rules={{
              validate: {
                maxImages: (value: File[]) =>
                  (value && value.length <= 6) || "Maximum 6 images autorisées",
                fileSize: (value: File[]) => {
                  if (!value || value.length === 0) return true;
                  const maxSize = 5 * 1024 * 1024; // 5MB
                  const oversizedFile = value.find(
                    (file) => file.size > maxSize
                  );
                  return (
                    !oversizedFile ||
                    `Le fichier "${oversizedFile.name}" dépasse 5MB`
                  );
                },
                fileType: (value: File[]) => {
                  if (!value || value.length === 0) return true;
                  const allowedTypes = [
                    "image/jpeg",
                    "image/jpg",
                    "image/png",
                    "image/svg+xml",
                    "image/gif",
                  ];
                  const invalidFile = value.find(
                    (file) => !allowedTypes.includes(file.type)
                  );
                  return (
                    !invalidFile ||
                    `Le fichier "${invalidFile.name}" n'est pas un format d'image valide`
                  );
                },
              },
            }}
            errors={errors}
            type="fileupload"
          />
          {/* Nom de l'exercice */}{" "}
        </div>
        <div className="bg-primary rounded-xl w-[650px] p-5 pr-0">
          <form onSubmit={handleSubmit(onSubmit)}>
            <ScrollArea className="h-[600px] pr-5">
              <div className="flex flex-col gap-4">
                {/* Nom de l'exercice */}
                <FormInput
                  name="name"
                  control={control}
                  rules={{
                    required: "Le nom de l'exercice est requis",
                    maxLength: {
                      value: 50,
                      message: "Le nom ne peut pas dépasser 50 caractères",
                    },
                  }}
                  title="Nom de l'exercice"
                  placeholder="Ex: Pompes"
                  errors={errors}
                  required={true}
                  type="input"
                />

                {/* Description */}
                <FormInput
                  name="description"
                  control={control}
                  rules={{
                    required: "La description de l'exercice est requise",
                    maxLength: {
                      value: 255,
                      message:
                        "La description ne peut pas dépasser 255 caractères",
                    },
                  }}
                  title="Description"
                  placeholder="Décrivez l'exercice..."
                  errors={errors}
                  type="textarea"
                  rows={3}
                  className="min-h-28 max-h-28"
                  required={true}
                />

                {/* Sélection de la catégorie */}
                <FormInput
                  name="category"
                  control={control}
                  rules={{
                    required: "La catégorie est requise",
                  }}
                  title="Catégorie"
                  placeholder="Sélectionnez une catégorie..."
                  errors={errors}
                  type="select"
                  required={true}
                  options={exerciseFormProps.categories.map((category) => ({
                    value: { id: category.id, name: category.name },
                    label: category.name,
                  }))}
                  className="w-full"
                />

                {/* Sélection des zones d'exercice */}
                <FormInput
                  name="zones"
                  control={control}
                  rules={{
                    required:
                      "Veuillez sélectionner au moins une zone d'exercice",
                  }}
                  title="Zones d'exercice"
                  placeholder="Sélectionnez les zones travaillées..."
                  errors={errors}
                  type="multiselect"
                  required={true}
                  options={exerciseFormProps.exerciseZones.map((zone) => ({
                    value: { id: zone.id, name: zone.name },
                    label: zone.name,
                  }))}
                />

                {/* Type d'exercice */}
                <div className="flex flex-col gap-3">
                  <label className="text-base font-medium">
                    Type d'exercice
                    <span className="text-rose-500 ml-1">*</span>
                  </label>
                  <RadioGroup
                    value={exerciseType}
                    onValueChange={(value) => {
                      const newType = value as "duration" | "repetition";
                      setValue("exerciseType", newType);

                      if (newType === "duration") {
                        setValue("caloriesPerRepetition", undefined);
                        setValue("defaultRepetitions", undefined);
                        clearErrors([
                          "caloriesPerRepetition",
                          "defaultRepetitions",
                        ]);
                      } else {
                        setValue("caloriesPerMinute", undefined);
                        setValue("defaultDuration", undefined);
                        clearErrors(["caloriesPerMinute", "defaultDuration"]);
                      }
                    }}
                    className="flex flex-row gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="duration" id="duration" />
                      <Label className="font-normal" htmlFor="duration">
                        Exercice de durée
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="repetition" id="repetition" />
                      <Label className="font-normal" htmlFor="repetition">
                        Exercice de répétition
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Champs conditionnels selon le type d'exercice */}
                <div className="grid grid-cols-2 gap-4">
                  {exerciseType === "duration" ? (
                    <>
                      <FormInput
                        name="caloriesPerMinute"
                        control={control}
                        rules={{
                          required: "Les calories par minute sont requises",
                          min: {
                            value: 0,
                            message: "La valeur doit être positive",
                          },
                        }}
                        title="Calories par minute"
                        placeholder="0"
                        errors={errors}
                        type="number"
                        step="0.1"
                        required={true}
                      />

                      <FormInput
                        name="defaultDuration"
                        control={control}
                        rules={{
                          required: "La durée par défaut est requise",
                          min: {
                            value: 0,
                            message: "La valeur doit être positive",
                          },
                        }}
                        title="Durée par défaut (min)"
                        placeholder="0"
                        errors={errors}
                        type="number"
                        required={true}
                      />
                    </>
                  ) : (
                    <>
                      <FormInput
                        name="caloriesPerRepetition"
                        control={control}
                        rules={{
                          required: "Les calories par répétition sont requises",
                          min: {
                            value: 0,
                            message: "La valeur doit être positive",
                          },
                        }}
                        title="Calories par répétition"
                        placeholder="0"
                        errors={errors}
                        type="number"
                        step="0.1"
                        required={true}
                      />

                      <FormInput
                        name="defaultRepetitions"
                        control={control}
                        rules={{
                          required: "Les répétitions par défaut sont requises",
                          min: {
                            value: 0,
                            message: "La valeur doit être positive",
                          },
                        }}
                        title="Répétitions par défaut"
                        placeholder="0"
                        errors={errors}
                        type="number"
                        required={true}
                      />
                    </>
                  )}

                  <FormInput
                    name="defaultSets"
                    control={control}
                    rules={{
                      required: "Les séries par défaut sont requises",
                      min: {
                        value: 0,
                        message: "La valeur doit être positive",
                      },
                    }}
                    title="Séries par défaut"
                    placeholder="0"
                    errors={errors}
                    type="number"
                    required={true}
                  />

                  <FormInput
                    name="defaultEquipmentWeight"
                    control={control}
                    rules={{
                      min: {
                        value: 0,
                        message: "La valeur doit être positive",
                      },
                    }}
                    title="Poids équipement (kg)"
                    placeholder="0"
                    errors={errors}
                    type="number"
                    step="0.5"
                  />
                </div>
              </div>
            </ScrollArea>
            {/* Boutons d'action */}
            <div className="flex gap-3 pt-4">
              <Button type="submit" className="bg-accent hover:bg-accent-hover">
                {exerciseFormProps.initialValues ? "Modifier" : "Créer"}{" "}
                l'exercice
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Annuler
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default ExerciseForm;
