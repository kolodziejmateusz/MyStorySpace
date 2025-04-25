/* eslint-disable @next/next/no-img-element */
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from '@/components/ui/menubar';

export default function Navbar() {
  return (
    <nav className="bg-orange-500 shadow">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-start gap-4 p-4 md:flex-row md:items-center md:justify-between">
        <div className="flex w-full justify-between md:w-auto">
          <img src="/logo.png" alt="Logo" className="h-8" />

          <div className="flex items-center gap-3 md:hidden">
            <Menubar>
              <MenubarMenu>
                <MenubarTrigger>
                  <img
                    src="/icons/hamburger-icon.png"
                    alt="Ikona książek"
                    className="h-6 w-6"
                  />
                </MenubarTrigger>
                <MenubarContent>
                  <MenubarItem>Login</MenubarItem>
                  <MenubarItem>Register</MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>Profile</MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          </div>
        </div>

        <div className="w-full md:max-w-md">
          <div className="flex w-full items-center rounded-full bg-blue-100 px-4 py-2 shadow">
            <img
              src="/icons/search.png"
              alt="Ikona szukaj"
              className="mr-3 h-5 w-5"
            />

            <input
              type="text"
              placeholder="Harry Potter"
              className="flex-grow bg-transparent text-gray-800 placeholder-gray-500 focus:outline-none"
            />

            <img
              src="/icons/book.png"
              alt="Ikona książek"
              className="ml-3 h-6 w-6"
            />
          </div>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <button className="p-2">Login</button>
          <button className="p-2">Register</button>
          <button className="p-2">Profile</button>
        </div>
      </div>
    </nav>
  );
}
