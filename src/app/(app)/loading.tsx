import { LoadingState } from "@/components/shared/states";

export default function AppLoading() {
  return (
    <div className="mx-auto max-w-6xl">
      <LoadingState label="Carregando sua missão…" />
    </div>
  );
}
