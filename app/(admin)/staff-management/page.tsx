import { getServerSession } from "next-auth";
import { getStaffs } from "../db/queries";

import { StaffManagementTable } from "./_components/staff-management-table";
import { authOptions } from "@/app/_utils/authOptions";
import { redirect } from "next/navigation";

export default async function StaffManagement() {
  const staffs = await getStaffs();

  const data = await getServerSession(authOptions);

  if (!data) {
    return null;
  }

  if (data?.user.role !== 1) {
    redirect("/");
  }

  return (
    <div>
      <StaffManagementTable staffs={staffs} />
    </div>
  );
}
