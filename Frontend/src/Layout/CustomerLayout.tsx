import { Outlet } from "react-router-dom";
import Header from "./Header";

export default function CustomerLayout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}
