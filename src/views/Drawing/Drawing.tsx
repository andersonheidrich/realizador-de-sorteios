import { AmericanCard, DoublesCard, SingleCard } from "./components/FormatCard";

const Drawing = () => {
  return (
    <div className="flex flex-col min-h-screen items-center pt-[90px] bg-white">
      <div className="my-8 text-[32px] font-bold">
        Escolha um dos formatos abaixo:
      </div>
      <div className="flex w-full justify-center items-center gap-8 px-4">
        <AmericanCard />
        <DoublesCard />
        <SingleCard />
      </div>
    </div>
  );
};

export default Drawing;
