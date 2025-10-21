import React from "react";
import { Input } from "@/components";
import { useUser } from "@/context/useUser";
import type { UserRegister } from "@/types/types";
import { useForm } from "@/hooks/useForm";

const Register = () => {
  const { userRegister } = useUser();
  const { values: user, handleChange } = useForm<UserRegister>({
    name: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  // Envia os dados do formulário
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validação simples de senha
    if (user.password !== user.confirm_password) {
      alert("As senhas não conferem!");
      return;
    }

    // Aqui você pode enviar os dados para o backend
    try {
      await userRegister({
        name: user.name,
        email: user.email,
        password: user.password,
        confirm_password: user.confirm_password,
      });
    } catch (error) {
      console.error("Erro ao registrar usuário:", error);
    }
  };

  return (
    <section>
      <div className="flex flex-col min-h-screen items-center pt-[90px] bg-white">
        <div className="my-8 text-[32px] font-bold">Cadastrar</div>
        <form onSubmit={handleSubmit} className="w-[300px]">
          <Input
            text="Nome"
            type="text"
            name="name"
            placeholder="Digite o seu nome"
            handleOnChange={handleChange}
          />
          <Input
            text="E-mail"
            type="email"
            name="email"
            placeholder="Digite o seu e-mail"
            handleOnChange={handleChange}
          />
          <Input
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
          />
          <input
            type="submit"
            value="Cadastrar"
            className="w-full rounded-lg border-none min-w-[100px] min-h-[2.5rem] shadow text-white bg-blue-600 hover:bg-blue-500 cursor-pointer font-bold text-[1.1em] transition-colors duration-300"
          />
        </form>
      </div>
    </section>
  );
};

export default Register;
