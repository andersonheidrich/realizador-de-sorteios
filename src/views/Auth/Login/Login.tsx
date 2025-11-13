import { Input } from "@/components";
import { useUser } from "@/contexts/useUser";
import type { UserLogin } from "@/types/types";
import { useForm } from "@/hooks/useForm";
import { useFlash } from "@/hooks/useFlash";

const Login = () => {
  const { login } = useUser();
  const { showFlash } = useFlash();
  const { values: user, handleChange } = useForm<UserLogin>({
    email: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validação dos campos
    if (!user.email.trim()) {
      showFlash("O e-mail é obrigatório!", "warning");
      return;
    }

    if (!user.password.trim()) {
      showFlash("A senha é obrigatória!", "warning");
      return;
    }

    login(user);
    showFlash(`Login efetuado com sucesso!`, "success");
  };

  return (
    <section>
      <div className="flex flex-col w-full min-h-screen items-center pt-22 px-5 bg-white">
        <div className="mt-8 text-3xl max-[425px]:text-[22px] font-bold">
          Entrar
        </div>
        <form onSubmit={handleSubmit} className="w-70 sm:w-100">
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
            className="w-full rounded-lg border-none min-w-25 min-h-10 shadow text-white bg-green-600 hover:bg-green-500 cursor-pointer font-bold text-[1.1em] transition-colors duration-300"
          />
        </form>
      </div>
    </section>
  );
};

export default Login;
