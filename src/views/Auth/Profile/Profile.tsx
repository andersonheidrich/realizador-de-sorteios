/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import api from "@/services/api";
import { Input, RoundedImage } from "@/components";
import type { UserEdit } from "@/types/types";

const Profile = () => {
  const [token] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState<UserEdit>({
    name: "",
    email: "",
    image: "",
  });
  const [preview, setPreview] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const { name } = event.target;

    if (file) {
      setPreview(file);
      setUser((prevUser) => ({
        ...prevUser,
        [name]: file,
      }));
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData();

    Object.keys(user).forEach((key) => {
      const value = user[key as keyof typeof user];
      if (value !== undefined && value !== null) {
        formData.append(key, value as any);
      }
    });

    try {
      const response = await api.patch(`/users/edit/${user._id}`, formData, {
        headers: {
          Authorization: `Bearer ${token.replace(/"/g, "")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error: any) {
      return error.response?.data;
    }
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const userRes = await api.get("/users/checkuser", {
          headers: { Authorization: `Bearer ${token.replace(/"/g, "")}` },
        });
        setUser(userRes.data);
      } catch (err) {
        console.error("Erro ao carregar perfil:", err);
        setError("Erro ao carregar dados do perfil.");
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchProfileData();
  }, [token]);

  if (loading) return <p className="text-center mt-8">Carregando...</p>;
  if (error) return <p className="text-center text-red-500 mt-8">{error}</p>;

  return (
    <section>
      <div className="flex flex-col min-h-screen items-center pt-[90px] bg-white">
        <div className="mt-8 mb-4 text-[32px] font-bold">Perfil</div>
        {(user.image || preview) && (
          <RoundedImage
            src={
              preview
                ? URL.createObjectURL(preview)
                : `http://localhost:5000/images/users/${user.image}`
            }
            alt={user.name}
            size="large"
          />
        )}
        <form onSubmit={handleSubmit} className="w-[300px]">
          <Input
            text="Imagem"
            type="file"
            name="image"
            handleOnChange={onFileChange}
          />
          <Input
            text="Nome"
            type="text"
            name="name"
            placeholder="Digite o seu nome"
            handleOnChange={handleChange}
            value={user.name || ""}
          />
          <Input
            text="E-mail"
            type="email"
            name="email"
            placeholder="Digite o seu e-mail"
            handleOnChange={handleChange}
            value={user.email || ""}
          />
          {/* <Input
            text="Senha"
            type="password"
            name="password"
            placeholder="Digite a sua senha"
            handleOnChange={handleChange}
          />
          <Input
            text="Confirmação de Senha"
            type="password"
            name="confirm_password"
            placeholder="Confirme a sua senha"
            handleOnChange={handleChange}
          /> */}
          <input
            type="submit"
            value="Salvar"
            className="w-full rounded-lg border-none min-w-[100px] min-h-[2.5rem] shadow text-white bg-green-600 hover:bg-green-500 cursor-pointer font-bold text-[1.1em] transition-colors duration-300"
          />
        </form>
      </div>
    </section>
  );
};

export default Profile;
