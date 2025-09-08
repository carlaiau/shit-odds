import { Navbar } from "@/catalyst/navbar";
import {
  Sidebar,
  SidebarHeader,
  SidebarItem,
  SidebarLabel,
} from "@/catalyst/sidebar";
import { SidebarLayout } from "@/catalyst/sidebar-layout";
import { HomeIcon, QuestionMarkCircleIcon } from "@heroicons/react/20/solid";
import { getSportsServer } from "@/lib/odds";

import NavbarFilters from "@/components/NavBarFilters";
import SideBarFilters from "@/components/SidebarFilters";
import "swiper/css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/grid";

export const revalidate = 60;

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sports = await getSportsServer();

  return (
    <SidebarLayout
      navbar={<Navbar>{sports && <NavbarFilters sports={sports} />}</Navbar>}
      sidebar={
        <Sidebar>
          <SidebarHeader>
            <SidebarItem to="/">
              <SidebarLabel>Home</SidebarLabel>
              <HomeIcon className="h-5 w-5 text-punt-400" />
            </SidebarItem>
            <SidebarItem to="/info">
              <SidebarLabel>Info</SidebarLabel>
              <QuestionMarkCircleIcon className="h-5 w-5 text-punt-400" />
            </SidebarItem>
            <SidebarItem to="https://github.com/carlaiau/shit-odds">
              <div className="flex justify-between w-full">
                <p>Github Repo</p>

                <img src="/icons/github.svg" className="w-4 h-4 opacity-70" />
              </div>
            </SidebarItem>
          </SidebarHeader>

          {sports && <SideBarFilters sports={sports} />}
        </Sidebar>
      }
    >
      {children}
    </SidebarLayout>
  );
}
