const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  try {
    // Criar modalidades
    const modalitys = [
      { name: "private" },
      { name: "auction" },
      { name: "bidding" },
    ];

    const status = [
      { name: "progress" },
      { name: "concluded" },
      { name: "finished" },
    ];

    const contracts = [
      {
        name: "Nome da Empresa",
        contracting: "Contratante",
        document: "123456789",
        address: "Endereço da Empresa",
        contractValue: 10000.0,
        refundAmount: 5000.0,
        companyHires: "Empresa contratada",
        contractDate: new Date("2024-01-01"),
        contractTerm: new Date("2026-12-31"),
        executedDate: new Date("2023-06-30"),
        executedValue: 7500.0,
      },
    ];

    for (let i = 0; i < 3; i++) {
      const modalityCreate = await prisma.modality.create({
        data: {
          name: modalitys[i].name,
        },
      });

      const statusCreate = await prisma.status.create({
        data: {
          name: status[i].name,
        },
      });

      // for (let i = 0; i < 10; i++) {
      //   await prisma.contract.create({
      //     data: {
      //       name: contracts[0].name + [i],
      //       contracting: contracts[0].contracting + [i],
      //       document: contracts[0].document,
      //       address: contracts[0].address,
      //       contractValue: contracts[0].contractValue,
      //       refundAmount: contracts[0].refundAmount,
      //       companyHires: contracts[0].companyHires + [i],
      //       contractDate: contracts[0].contractDate,
      //       contractTerm: contracts[0].contractTerm,
      //       executedDate: contracts[0].executedDate,
      //       executedValue: contracts[0].executedValue,
      //       modality: {
      //         connect: {
      //           id: modalityCreate.id,
      //         },
      //       },
      //       status: {
      //         connect: {
      //           id: statusCreate.id,
      //         },
      //       },
      //     },
      //   });
      // }
    }
  } catch (error) {
    console.error("Erro ao popular o banco de dados:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
