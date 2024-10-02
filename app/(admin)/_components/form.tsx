"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

const schemaForm = z.object({
  name: z.string(),
  contracting: z.string(),
  document: z.string(),
  address: z.string(),
  contractValue: z.coerce.number().min(1),
  refundAmount: z.coerce.number().min(1),
  companyHires: z.string(),
  contractDate: z.string(),
  contractTerm: z.string(),
  status: z.string(),
  executedDate: z.string(),
  executedValue: z.coerce.number().min(1),
});

type dataFormType = z.infer<typeof schemaForm>;

export function Form() {
  const [datad, setData] = useState<dataFormType>();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<dataFormType>({
    resolver: zodResolver(schemaForm),
  });

  const lucro = datad?.contractValue! - datad?.refundAmount!;
  const rentabilidate = (lucro / datad?.contractValue!) * 100;
  const total = datad?.contractValue! - datad?.executedValue!;

  function handleSubmitData(data: dataFormType) {
    setData(data);
  }

  return (
    <section className="h-screen bg-background">
      <form onSubmit={handleSubmit(handleSubmitData)}>
        <p>{errors.refundAmount?.message}</p>
        <label htmlFor="name">
          Name:
          <input
            type="text"
            {...register("name")}
            id="name"
            placeholder="name"
          />
        </label>
        <label htmlFor="contracting">
          Contrante:
          <input
            {...register("contracting")}
            id="contracting"
            placeholder="contracting"
          />
        </label>
        <label htmlFor="document">
          CNPJ/CPF:
          <input
            {...register("document")}
            id="document"
            placeholder="document"
          />
        </label>
        <label htmlFor="address">
          Endereco:
          <input {...register("address")} id="address" placeholder="address" />
        </label>
        Valor do contrato:
        <input
          {...register("contractValue")}
          id="contractValue"
          placeholder="contractValue"
        />
        <label htmlFor="refundAmount">
          Valor de desembolso:
          <input
            {...register("refundAmount")}
            id="refundAmount"
            placeholder="refundAmount"
          />
        </label>
        <label htmlFor="companyHires">
          Empresa contrata:
          <input
            {...register("companyHires")}
            id="companyHires"
            placeholder="conpanyHires"
          />
        </label>
        <label htmlFor="contractDate">
          Data do contrato:
          <input
            {...register("contractDate")}
            id="contractDate"
            placeholder="contractDate"
            type="date"
          />
        </label>
        <label htmlFor="contractTerm">
          Prazo do contrato:
          <input
            {...register("contractTerm")}
            id="contractTerm"
            placeholder="contractTerm"
            type="date"
          />
        </label>
        <label htmlFor="status">
          status:
          <input {...register("status")} id="status" placeholder="status" />
        </label>
        <label htmlFor="executedDate">
          Data Executada:
          <input
            {...register("executedDate")}
            id="executedDate"
            placeholder="executedDate"
            type="date"
          />
        </label>
        <label htmlFor="executedValue">
          Valor executado
          <input
            {...register("executedValue")}
            id="executedValue"
            placeholder="executedValue"
          />
        </label>
        <button type="submit">enviar</button>
      </form>
    </section>
  );
}
