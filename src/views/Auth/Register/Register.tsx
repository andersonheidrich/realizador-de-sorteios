import React from "react";
import { Input } from "@/components";
import { useUser } from "@/contexts/useUser";
import type { UserRegister } from "@/types/types";
import { useForm } from "@/hooks/useForm";
import { useFlash } from "@/hooks/useFlash";

const Register = () => {
  const { userRegister } = useUser();
  const { showFlash } = useFlash();
  const { values: user, handleChange } = useForm<UserRegister>({
    name: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  // Envia os dados do formulário
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validação dos campos
    if (!user.name.trim()) {
      showFlash("O nome é obrigatório!", "warning");
      return;
    }

    if (!user.email.trim()) {
      showFlash("O e-mail é obrigatório!", "warning");
      return;
    }

    if (!user.password.trim()) {
      showFlash("A senha é obrigatória!", "warning");
      return;
    }

    if (!user.confirm_password.trim()) {
      showFlash("A confirmação da senha é obrigatória!", "warning");
      return;
    }

    // Validação simples de senha
    if (user.password !== user.confirm_password) {
      showFlash("As senhas não conferem!", "warning");
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
      <div className="flex flex-col w-full min-h-screen items-center pt-22 px-5 bg-white">
        <div className="mt-8 text-3xl max-[425px]:text-[22px] font-bold">
          Cadastrar
        </div>
        <form onSubmit={handleSubmit} className="w-70 sm:w-100">
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
            className="w-full rounded-lg border-none min-w-25 min-h-10 shadow text-white bg-blue-600 hover:bg-blue-500 cursor-pointer font-bold text-[1.1em] transition-colors duration-300"
          />
        </form>
      </div>
    </section>
  );
};

export default Register;
