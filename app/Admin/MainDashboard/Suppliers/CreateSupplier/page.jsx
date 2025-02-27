"use client";
import React from "react";
import CreateSupplier from "../../../components/CreateSupplier";
import { useSearchParams } from "next/navigation";
import EditSupplier from "../../../components/EditSupplier";
const page = () => {
  const params = useSearchParams();
  const edit = params.get("edit") || false;
  return <div>{edit ? <EditSupplier /> : <CreateSupplier />}</div>;
};

export default page;
