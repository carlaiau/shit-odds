import { Navbar } from "@/catalyst/navbar";
import {
  Sidebar,
  SidebarFooter,
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
          </SidebarHeader>

          {sports && <SideBarFilters sports={sports} />}

          <SidebarFooter />
        </Sidebar>
      }
    >
      {children}
    </SidebarLayout>
  );
}
