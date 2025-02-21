import DarkModeToggle from "./DarkModeToggle";

export function Header() {
  return (
    <header className="bg-[#191818] dark:bg-[#191818] shadow-md px-6 py-4 flex justify-between items-center border-b border-gray-700 transition-colors">
      <h1 className="text-2xl font-bold text-white">Task Manager</h1>
      <DarkModeToggle />
    </header>
  );
}
