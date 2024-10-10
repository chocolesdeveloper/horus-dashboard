"use client";

import { useMountedState } from "react-use";

import { CreateContract } from "../_components/create-contract";

import { CreateStaff } from "../_components/create-staff";
import { UpdateStaff } from "../_components/update-staff";

export function DialogProvider() {
  const isMounted = useMountedState();

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <CreateContract />

      <CreateStaff />
      <UpdateStaff />
    </>
  );
}
