import * as PDFJS from "pdfjs-dist";
import { v4 as uuidv4 } from "uuid";

PDFJS.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${PDFJS.version}/build/pdf.worker.mjs`;

export const useInvoiceReaderPdf = async (file: File) => {
  if (file.type !== "application/pdf") {
    alert("Format bon tidak dikenali");
    return;
  }

  const arrBuffer = await file.arrayBuffer();

  const loadingTask = PDFJS.getDocument(arrBuffer);
  await loadingTask.promise.then((doc) => {
    doc.getPage(1).then((page) => {
      page.getTextContent().then((textContent) => {
        const content = textContent.items
          .map((item) => item?.["str"])
          .filter((item) => item)
          .join(" ");

        const router = useRouter();

        if (content.includes("Gojek")) {
          gojekInvoiceParser(content);
          router.push("/bagi");
          return;
        }

        alert("Format bon tidak dikenali");
      });
    });
  });
};

const gojekInvoiceParser = (content: string) => {
  const restaurantPattern = /(dari )([^\n]+?)\,/;
  const menuPattern = /(?<=Rincian transaksi\s)(?:\d+\s+[^\n]+\s+@Rp\d{1,3}(?:\.\d{3})*\s+Rp\d{1,3}(?:\.\d{3})*\s*)+/i;
  const menuItemPattern = /(\d+)\s+(.+?)\s+@Rp(\d{1,3}(?:\.\d{3})*)\s+Rp(\d{1,3}(?:\.\d{3})*)/g;
  const deliveryPricePattern = /biaya.+pengiriman\s+Rp(\d{1,3}(?:\.\d{3})*)/gi;
  const servicePricePattern = /biaya.+lainnya\s+Rp(\d{1,3}(?:\.\d{3})*)/gi;
  const discountPattern = /(discount|diskon|potongan)\s+?[^\n]*-Rp(\d{1,3}(?:\.\d{3})*)/gi;

  // menu items
  const menuBlockMatch = content.match(menuPattern);
  const menuBlock = menuBlockMatch ? menuBlockMatch[0] : "";

  let menuItems = [];
  let match;
  while ((match = menuItemPattern.exec(menuBlock)) !== null) {
    const amount = +match[1];
    for (let i = 1; i <= amount; i++) {
      menuItems.push({
        name: match[2],
        price: match[3].replace(".", ""),
      });
    }
  }

  // order info
  const orderInfo = {
    restaurant: "",
    delivery: "",
    service: "",
    discount: "",
  };
  const restaurantMatch = restaurantPattern.exec(content);
  const deliveryMatch = deliveryPricePattern.exec(content);
  const serviceMatch = servicePricePattern.exec(content);
  const discountMatch = discountPattern.exec(content);

  if (restaurantMatch) orderInfo.restaurant = restaurantMatch[2];
  if (deliveryMatch) orderInfo.delivery = deliveryMatch[1].replace(".", "");
  if (serviceMatch) orderInfo.service = serviceMatch[1].replace(".", "");
  if (discountMatch) orderInfo.discount = discountMatch[2].replace(".", "");

  fillInput(menuItems, orderInfo);
};

const fillInput = (
  menus: { name: string; price: string }[],
  info: { restaurant: string; delivery: string; service: string; discount: string }
) => {
  const members = useMembers();
  const order = useOrder();
  const savedMembers = useCookie("saved_members");

  if (savedMembers.value) {
    const newMembers = savedMembers.value.map((member) => ({
      name: member,
      menus: [],
    }));
    menus.map((menu, iMenu) => {
      const iMember = iMenu >= newMembers.length ? iMenu % newMembers.length : iMenu;
      newMembers[iMember].menus.push({
        id: uuidv4(),
        ...menu,
      });
    });
    members.value = newMembers;
  } else {
    members.value = [
      {
        name: "Udin",
        menus: menus.map((menu) => ({
          id: uuidv4(),
          ...menu,
        })),
      },
    ];
  }

  order.value.restaurant = info.restaurant;
  order.value.delivery = info.delivery;
  order.value.service = info.service;
  order.value.discount = info.discount;
};
