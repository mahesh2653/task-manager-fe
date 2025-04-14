"use client";
import CustomLoader from "@/components/customloader";
import UserDashboard from "@/components/usreDashboard";
import { useAuth } from "@/services/authContext";
import IRoles from "@/type/role";
const { ADMIN, STUDENT, USER } = IRoles;

export default function Home() {
  const { user } = useAuth();
  if (!user) {
    return <CustomLoader />;
  }
  return <>{user?.role === USER && <UserDashboard id={user?.id} />}</>;
}
