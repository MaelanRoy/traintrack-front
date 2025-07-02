import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import FormField from "./FormField";
import { useRegister } from "@/hooks/useRegister";
import type { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const registerSchema = yup.object().shape({
  username: yup
    .string()
    .min(3, "Le nom d'utilisateur doit comporter au moins 3 caractères")
    .max(30, "Le nom d'utilisateur ne doit pas dépasser 30 caractères")
    .required("Le nom d'utilisateur est requis"),
  email: yup
    .string()
    .email("Adresse e-mail invalide")
    .max(100, "L'email ne doit pas dépasser 100 caractères")
    .required("L'email est requis"),
  password: yup
    .string()
    .min(8, "Le mot de passe doit comporter au moins 8 caractères")
    .max(100, "Le mot de passe ne doit pas dépasser 100 caractères")
    .matches(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
    .matches(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule")
    .matches(
      /[^A-Za-z0-9]/,
      "Le mot de passe doit contenir un caractère spécial"
    )
    .required("Le mot de passe est requis"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Les mots de passe ne correspondent pas")
    .required("La confirmation du mot de passe est requise"),
});

interface RegisterDialogProps {
  trigger: React.ReactNode;
}

export const RegisterDialog = ({ trigger }: RegisterDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const navigate = useNavigate();

  const {
    isPending: isLoadingRegister,
    isSuccess: isSuccessRegister,
    isError: isErrorRegister,
    error: registerError,
    mutate: signup,
    reset: resetMutation,
  } = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset: resetForm,
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
  });

  useEffect(() => {
    if (isSuccessRegister) {
      console.log("Inscription réussie !");
      setSuccessMessage(
        "Inscription réussie ! Vous pouvez maintenant vous connecter."
      );
      setErrorMessage("");
      resetForm();

      const timer = setTimeout(() => {
        setIsOpen(false);
        setSuccessMessage("");
        resetMutation();
      }, 2000);

      return () => clearTimeout(timer);
    }
    navigate("/");
  }, [isSuccessRegister, resetForm, resetMutation, navigate]);

  useEffect(() => {
    if (isErrorRegister && registerError) {
      const axiosError = registerError as AxiosError;

      if (axiosError.response?.status === 400) {
        const errorMessage = axiosError.response.data as string;

        if (errorMessage.includes("Email already exists")) {
          setErrorMessage("Cet email est déjà utilisé");
        } else if (errorMessage.includes("Username already exists")) {
          setErrorMessage("Ce nom d'utilisateur est déjà pris");
        } else {
          setErrorMessage("Données invalides, vérifiez vos informations");
        }
      } else if (axiosError.response?.status === 500) {
        setErrorMessage("Erreur serveur, veuillez réessayer plus tard");
      } else if (axiosError.code === "NETWORK_ERROR" || !axiosError.response) {
        setErrorMessage("Erreur de connexion au serveur");
      } else {
        setErrorMessage("Une erreur est survenue lors de l'inscription");
      }

      setSuccessMessage("");
    }
  }, [isErrorRegister, registerError]);

  const onRegisterSubmit = (data: RegisterFormData) => {
    setErrorMessage("");
    setSuccessMessage("");

    signup({
      username: data.username,
      email: data.email,
      password: data.password,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Inscription</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onRegisterSubmit)}
          className="flex flex-col gap-[19px]"
        >
          {/* Affichage des erreurs */}
          {errorMessage && (
            <div className="p-3 bg-red-100 border border-red-400 text-rose-500 rounded">
              {errorMessage}
            </div>
          )}

          {/* Affichage du succès */}
          {successMessage && (
            <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              {successMessage}
            </div>
          )}

          <FormField
            type="text"
            name="username"
            placeholder="Nom d'utilisateur"
            register={register}
            error={errors.username}
          />
          <FormField
            type="email"
            name="email"
            placeholder="Email"
            register={register}
            error={errors.email}
          />
          <FormField
            type="password"
            name="password"
            placeholder="Mot de passe"
            register={register}
            error={errors.password}
          />
          <FormField
            type="password"
            name="confirmPassword"
            placeholder="Confirmer le mot de passe"
            register={register}
            error={errors.confirmPassword}
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                disabled={isLoadingRegister}
              >
                Annuler
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isLoadingRegister}>
              {isLoadingRegister ? "Inscription..." : "S'inscrire"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
