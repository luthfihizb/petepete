import { v4 as uuidv4 } from "uuid";

export const useInvoiceReader = async (file: any) => {
  const { createWorker } = Tesseract;
  const worker = await createWorker();
  const router = useRouter();

  await worker.loadLanguage("ind");
  await worker.initialize("ind");
  const {
    data: { text },
  } = await worker.recognize(file);

  const isParsed = parseInvoice(text);

  await worker.terminate();

  if (isParsed) router.push("/bagi");
  else alert("Format bon tidak dikenali");
};

const parseInvoice = (text: String) => {
  const parsers = [
    { keyword: "gojek", parse: gojekInvoiceParser },
    { keyword: "Selamat menikmati makanan Anda!", parse: grabInvoiceParser },
  ];

  let parsed = false;
  parsers.find((parser) => {
    if (text.includes(parser.keyword)) {
      parsed = parser.parse(text);
      return true;
    }
  });

  return parsed;
};

const spreadMenu = (menus: { id: string; name: string; price: string }[]) => {
  const members = useMembers();
  const savedMembers = useCookie("saved_members");

  if (savedMembers.value) {
    const newMembers = savedMembers.value.map((member) => ({
      name: member,
      menus: [],
    }));
    menus.map((menu, iMenu) => {
      const iMember = iMenu >= newMembers.length ? iMenu % newMembers.length : iMenu;
      newMembers[iMember].menus.push(menu);
    });
    members.value = newMembers;
  } else {
    members.value = [
      {
        name: "Udin",
        menus,
      },
    ];
  }
};

const gojekInvoiceParser = (text: String): boolean => {
  const menus: { id: string; name: string; price: string }[] = [];

  text
    .split("\n")
    .slice(6)
    .filter((row) => {
      const matchRow = row.match(/^(\d+\s)(.+)(\s@.+\sRp)([\d.]+)/);

      if (matchRow) {
        const newMenu = {
          id: uuidv4(),
          name: matchRow[2],
          price: matchRow[4].replace(".", ""),
        };
        menus.push(newMenu);
      }
    });

  spreadMenu(menus);

  return true;
};

const grabInvoiceParser = (text: String): boolean => {
  const menus: { id: string; name: string; price: string }[] = [];

  const matchedMenus = text.replace(/\n/g, " ").match(/(\d+[x]\s)([\D\s]+)(\sRp\s?)(\d+)/g) || [];
  matchedMenus.map((row) => {
    const matchRow = row.match(/(\d+[x]\s)([\D\s]+)(\sRp\s?)(\d+)/);

    if (matchRow) {
      const newMenu = {
        id: uuidv4(),
        name: matchRow[2],
        price: matchRow[4],
      };
      menus.push(newMenu);
    }
  });

  spreadMenu(menus);

  return true;
};
