import "./App.css";
import { AutoCompleteInput } from "./components/AutoCompleteInput";

const CITIES = [
  "Москва",
  "Санкт-Петербург",
  "Новосибирск",
  "Екатеринбург",
  "Казань",
  "Нижний Новгород",
  "Челябинск",
  "Самара",
  "Омск",
  "Ростов-на-Дону",
  "Уфа",
  "Красноярск",
  "Воронеж",
  "Пермь",
  "Волгоград",
];

function App() {
  return (
    <>
      <AutoCompleteInput
        options={CITIES}
        placeholder="Введите название города"
      />
    </>
  );
}

export default App;
