import { Outlet } from "react-router-dom";

import Header from "@/components/shared/header";
import Container from "@/components/shared/container";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg(--background)">
      <Header />

      <Container>
        <Outlet />
      </Container>
    </div>
  );
}