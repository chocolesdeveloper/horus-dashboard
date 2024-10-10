"use client";

import { Users } from "lucide-react";

import { useNewStaff } from "../../hooks/use-new-staff";

import { TabletStaff } from "./table-staff";
import { Button } from "@/components/ui/button";

import { Staff } from "@prisma/client";

interface StaffManagementTableProps {
  staffs: Staff[];
}

export function StaffManagementTable({ staffs }: StaffManagementTableProps) {
  const { onOpen } = useNewStaff();

  return (
    <div className="container -mt-20 pb-4">
      <div className="flex flex-col gap-4 rounded-lg bg-white p-5 shadow-lg">
        <div className="flex items-center justify-between pb-4">
          <div className="flex items-center gap-2 text-gray-900">
            <Users className="h-6 w-6 text-horus" />
            <h1 className="text-sm font-semibold md:text-base lg:text-3xl">
              Gestão de pessoal
            </h1>
          </div>
          <Button
            variant="horus"
            onClick={onOpen}
            className="text-sm md:text-base lg:text-lg"
          >
            Criar membro
          </Button>
        </div>
        <TabletStaff staffs={staffs} />
      </div>
    </div>
  );
}
