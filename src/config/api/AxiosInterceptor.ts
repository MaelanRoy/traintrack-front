import { useEffect, useState, type ReactNode } from "react";

import { useNavigate } from "react-router";

import api from "@/config/api/ApiConfig";

interface Props {
  children?: ReactNode;
}

export const AxiosInterceptor = ({ children }: Props) => {
  const navigate = useNavigate();
  const [isSet, setIsSet] = useState(false);

  useEffect(() => {
    const reqInterceptorEject = api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token");
        if (token) {
          config.headers["Authorization"] = token;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    const resInterceptorEject = api.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/");
        }
        return Promise.reject(error);
      }
    );

    setIsSet(true);
    return () => {
      api.interceptors.request.eject(reqInterceptorEject);
      api.interceptors.response.eject(resInterceptorEject);
    };
  }, [navigate]);

  return isSet && children;
};
