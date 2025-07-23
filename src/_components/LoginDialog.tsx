import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
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
import FormInput from "./FormInput";
import { useLogin } from "@/hooks/useLogin";
import type LoginRequest from "@/models/LoginRequest";
import { useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Adresse e-mail invalide")
    .required("L'email est requis"),
  password: yup.string().required("Le mot de passe est requis"),
});

interface LoginDialogProps {
  trigger: React.ReactNode;
}

export const LoginDialog = ({ trigger }: LoginDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    isPending: isLoadingLogin,
    isSuccess: isSuccessLogin,
    isError: isErrorLogin,
    error: loginError,
    mutate: login,
    reset: resetMutation,
  } = useLogin();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset: resetForm,
  } = useForm<LoginRequest>({
    resolver: yupResolver(loginSchema),
  });

  useEffect(() => {
    if (isSuccessLogin) {
      console.log("Connexion réussie !");
      setErrorMessage("");
      resetForm();
      setIsOpen(false);
      queryClient.invalidateQueries();
      navigate("/");
    }
  }, [isSuccessLogin, resetForm, resetMutation, queryClient, navigate]);

  useEffect(() => {
    if (isErrorLogin && loginError) {
      console.error("Erreur lors de la connexion :", loginError);

      const axiosError = loginError as AxiosError;

      if (axiosError.response?.status === 401) {
        setErrorMessage("Email ou mot de passe incorrect");
      } else if (axiosError.response?.status === 500) {
        setErrorMessage("Erreur serveur, veuillez réessayer plus tard");
      } else if (axiosError.code === "NETWORK_ERROR" || !axiosError.response) {
        setErrorMessage("Erreur de connexion au serveur");
      } else {
        setErrorMessage("Une erreur est survenue lors de la connexion");
      }
    }
  }, [isErrorLogin, loginError]);

  const onSubmit = (data: LoginRequest) => {
    console.log("Données de connexion :", data);
    setErrorMessage("");
    login(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Connexion</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-[19px]"
        >
          {errorMessage && (
            <div className="p-3 bg-red-100 border border-red-400 text-rose-500 rounded">
              {errorMessage}
            </div>
          )}
          <FormInput
            type="email"
            name="email"
            placeholder="Email"
            control={control}
            errors={errors}
            rules={{
              required: "L'email est requis",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Adresse e-mail invalide",
              },
            }}
          />
          <FormInput
            type="password"
            name="password"
            placeholder="Mot de passe"
            control={control}
            errors={errors}
            rules={{
              required: "Le mot de passe est requis",
            }}
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isLoadingLogin}>
                Annuler
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isLoadingLogin}>
              {isLoadingLogin ? "Connexion..." : "Se connecter"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
