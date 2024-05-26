<template>
  <div class="w-full md:px-[10vw] flex flex-col gap-10">
    <Head>
      <Title>Invoice - Petepete</Title>
    </Head>

    <Header />

    <div class="bg-gray-100 p-6 flex flex-col gap-8 shadow-md" id="print-invoice">
      <div class="text-center">
        <Header />
        <span class="text-sm">Split Bill</span>
      </div>

      <div class="flex flex-col text-sm">
        <b class="text-base">{{ order.restaurant }}</b>
        <span>{{ moment().format("DD-MM-YYYY, kk:mm") }}</span>
        <hr class="my-2 border-gray-500" />

        <table>
          <thead class="text-left">
            <th class="w-10">No.</th>
            <th>Member</th>
            <th class="w-1/3 text-right">Harus bayar</th>
          </thead>
          <tr v-for="(member, iMember) in calculatedMembers" :key="iMember">
            <td>{{ iMember + 1 }}</td>
            <td>{{ member.name }}</td>
            <td class="text-right">{{ rupiah.format(member.priceToPay) }}</td>
          </tr>
        </table>
      </div>

      <div class="flex flex-col text-sm">
        <b>Detail Transaksi</b>
        <hr class="my-2 border-gray-500" />

        <table>
          <thead class="text-left">
            <th class="w-10">No.</th>
            <th>Member (Menu)</th>
            <th class="w-1/3 text-right">Harga</th>
          </thead>
          <template v-for="(member, iMember) in calculatedMembers" :key="iMember">
            <tr>
              <td>{{ iMember + 1 }}</td>
              <td colspan="2" class="font-semibold">{{ member.name }}</td>
            </tr>
            <tr v-for="(menu, iMenu) in member.menus" :key="iMenu">
              <td></td>
              <td class="pl-4">{{ menu.name }}</td>
              <td class="text-right">{{ rupiah.format(menu.price) }}</td>
            </tr>
            <tr>
              <td></td>
              <td class="pl-4">Ongkir</td>
              <td class="text-right">{{ rupiah.format(calculatedOrder.deliveryPerMember) }}</td>
            </tr>
            <tr>
              <td></td>
              <td class="pl-4">Biaya aplikasi</td>
              <td class="text-right">{{ rupiah.format(calculatedOrder.servicePerMember) }}</td>
            </tr>
            <tr>
              <td></td>
              <td class="pl-4">Diskon</td>
              <td class="text-right">{{ rupiah.format(member.discount * -1) }}</td>
            </tr>
            <tr>
              <td></td>
              <td colspan="2"><div class="w-full h-[1px] bg-gray-400 my-1"></div></td>
            </tr>
            <tr class="font-semibold">
              <td></td>
              <td class="pl-4"><div class="mb-2">Total</div></td>
              <td class="text-right">{{ rupiah.format(member.priceToPay) }}</td>
            </tr>
          </template>
        </table>
      </div>

      <div class="flex flex-col text-sm">
        <b>Order</b>
        <hr class="my-2 border-gray-500" />

        <table>
          <tr>
            <td>Total Harga</td>
            <td class="text-right">{{ rupiah.format(calculatedOrder.totalPrice) }}</td>
          </tr>
          <tr>
            <td>Ongkir</td>
            <td class="text-right">{{ rupiah.format(calculatedOrder.delivery) }}</td>
          </tr>
          <tr>
            <td>Biaya aplikasi (service)</td>
            <td class="text-right">{{ rupiah.format(calculatedOrder.service) }}</td>
          </tr>
          <tr>
            <td>Diskon</td>
            <td class="text-right">{{ rupiah.format(calculatedOrder.discount) }}</td>
          </tr>
          <tr class="font-semibold">
            <td>Harga akhir</td>
            <td class="text-right">{{ rupiah.format(calculatedOrder.totalPaid) }}</td>
          </tr>
        </table>
      </div>

      <div class="flex flex-col items-center text-xs">
        <p><b>Pisah Bon</b> jadi gampang pakai <b>petepete</b></p>
        <p class="underline underline-offset-4">petepete.netlify.app</p>
      </div>
    </div>

    <button class="btn-primary" @click="printInvoice">Unduh Bon</button>
  </div>
</template>

<script setup>
import moment from "moment";
import html2canvas from "html2canvas";

const rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
});

const order = useOrder();
const members = useMembers();

const memberCount = members.value.length;
const calculatedMembers = [
  ...members.value.map((member) => {
    member.totalPrice = member.menus.map((menu) => menu.price).reduce((a, b) => +a + +b);
    return member;
  }),
];

const calculatedOrder = {
  ...order.value,
  deliveryPerMember: Math.round(order.value.delivery / memberCount),
  servicePerMember: Math.round(order.value.service / memberCount),
};
calculatedOrder.totalPrice = calculatedMembers.map((member) => member.totalPrice).reduce((a, b) => +a + +b);
calculatedOrder.totalPaid =
  calculatedOrder.totalPrice + +calculatedOrder.delivery + +calculatedOrder.service - +calculatedOrder.discount;

calculatedMembers.map((member, iMember) => {
  const discount = Math.round(calculatedOrder.discount * (member.totalPrice / calculatedOrder.totalPrice));

  calculatedMembers[iMember].discount = discount;
  calculatedMembers[iMember].priceToPay =
    +member.totalPrice + calculatedOrder.deliveryPerMember + calculatedOrder.servicePerMember - discount;
});

const printInvoice = async () => {
  const printComponent = document.querySelector("#print-invoice");
  const printCanvas = await html2canvas(printComponent, {
    type: "dataURL",
  });

  const link = document.createElement("a");
  link.setAttribute("download", `${calculatedOrder.restaurant} - ${moment().format("DD-MM-YYYY_kk-mm")}.png`);
  link.setAttribute("href", printCanvas.toDataURL("image/png").replace("image/png", "image/octet-stream"));
  link.click();

  saveMembers();
};
const saveMembers = () => {
  const savedMembersCookie = useCookie("saved_members");
  savedMembersCookie.value = JSON.stringify(calculatedMembers.map((member) => member.name));
};
</script>
