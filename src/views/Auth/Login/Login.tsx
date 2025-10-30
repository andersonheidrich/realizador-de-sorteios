import { Input } from "@/components";
import { useUser } from "@/context/useUser";
import type { UserLogin } from "@/types/types";
import { useForm } from "@/hooks/useForm";

const Login = () => {
  const { login } = useUser();
  const { values: user, handleChange } = useForm<UserLogin>({
    email: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login(user);
  };

  return (
    <section>
      <div className="flex flex-col min-h-screen items-center pt-[90px] bg-white">
        <div className="mt-8 text-3xl font-bold">Entrar</div>
        <form onSubmit={handleSubmit} className="w-[300px]">
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
          <input
            type="submit"
            value="Entrar"
            className="w-full rounded-lg border-none min-w-[100px] min-h-[2.5rem] shadow text-white bg-green-600 hover:bg-green-500 cursor-pointer font-bold text-[1.1em] transition-colors duration-300"
          />
        </form>
      </div>
    </section>
  );
};

export default Login;
