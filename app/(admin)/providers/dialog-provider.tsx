"use client";

import { useMountedState } from "react-use";
import { CreateContract } from "../(home)/_components/create-contract";

export function DialogProvider() {
  const isMounted = useMountedState();

  if (!isMounted) {
    return null;
  }

  return <CreateContract />;
}
