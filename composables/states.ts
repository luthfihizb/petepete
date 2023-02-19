export const useOrder = () =>
  useState("order", () => ({
    restaurant: "",
    delivery: "0",
    service: "0",
    discount: "0",
  }));
export const useMembers = () =>
  useState("members", () => [
    {
      name: "Udin",
      menus: [
        {
          id: "1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed",
          name: "Ayam goreng",
          price: "15500",
        },
      ],
    },
  ]);
