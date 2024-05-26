<template>
  <div class="w-full md:px-[16vw] flex flex-col gap-10">
    <Head>
      <Title>Bagi Menu - Petepete</Title>
    </Head>

    <Header />

    <div class="flex flex-col gap-4">
      <div class="flex flex-col">
        <label for="restaurant" class="w-40">Restoran</label>
        <input
          class="text-3xl font-semibold bg-transparent underline underline-offset-8 decoration-1 outline-none"
          name="restaurant"
          placeholder="Nama Restoran"
          v-model="order.restaurant"
        />
      </div>

      <div
        v-for="(member, iMember) in members"
        :key="iMember"
        class="flex flex-col gap-4 bg-gradient-to-r from-[#283a32] to-[#237A57] rounded-lg text-white p-4"
      >
        <div class="flex justify-between items-center">
          <div class="flex gap-2 items-center">
            <UserIcon class="w-6" />
            <input
              placeholder="Nama"
              v-model="member.name"
              class="bg-transparent text-xl pt-1 font-semibold underline underline-offset-4 decoration-1 outline-none w-full"
            />
          </div>
          <TrashIcon class="w-5 opacity-70" @click="removeMember(iMember)" />
        </div>
        <draggable
          v-bind="dragOptions"
          :list="member.menus"
          group="menu"
          item-key="id"
          handle=".handle"
          class="flex flex-col gap-4"
        >
          <template #item="{ element: menu, index: iMenu }">
            <div class="flex gap-2">
              <div class="flex handle">
                <EllipsisVerticalIcon class="w-4 -mr-[10px]" />
                <EllipsisVerticalIcon class="w-4" />
              </div>
              <FormInput placeholder="Menu" v-model="menu.name" class="text-sm w-full" />
              <FormInput placeholder="Harga" v-model="menu.price" type="number" class="w-20 text-sm text-right" />
              <MinusCircleIcon class="w-10" @click="removeMenu(iMember, iMenu)" />
            </div>
          </template>
        </draggable>
        <button class="w-full flex justify-center items-center gap-1 text-sm" @click="addMenu(iMember)">
          <PlusIcon class="w-4" />
          <p>Tambah menu</p>
        </button>
      </div>
      <button class="w-full flex justify-center items-center gap-1 bg-[#cedcd3] p-3 rounded-lg mb-4" @click="addMember">
        <UserPlusIcon class="w-4" /> Tambah member
      </button>

      <div class="flex flex-col gap-4 mb-4">
        <div class="flex gap-4 justify-between items-center">
          <label for="delivery">
            <p class="font-bold text-lg">Ongkir</p>
            <p class="text-sm leading-4">Biaya pengiriman, Biaya ongkir, delivery</p>
          </label>
          <FormInput
            name="delivery"
            type="number"
            placeholder="Ongkir"
            v-model="order.delivery"
            class="font-bold text-right w-24 border-gray-500"
          />
        </div>
        <div class="flex gap-4 justify-between items-center">
          <label for="service">
            <p class="font-bold text-lg">Biaya aplikasi</p>
            <p class="text-sm leading-4">Biaya lainnya, service</p>
          </label>
          <FormInput
            name="service"
            type="number"
            placeholder="Biaya aplikasi"
            v-model="order.service"
            class="font-bold text-right w-24 border-gray-500"
          />
        </div>
        <div class="flex gap-4 justify-between items-center">
          <label for="discount">
            <p class="font-bold text-lg">Diskon</p>
            <p class="text-sm leading-4">Biaya Potongan, Promo</p>
          </label>
          <FormInput
            name="discount"
            type="number"
            placeholder="Diskon"
            v-model="order.discount"
            class="font-bold text-right w-24 border-gray-500"
          />
        </div>
      </div>

      <div class="p-4 bg-[#cedcd3] rounded-lg">
        <div class="mb-4">
          <h2 class="font-bold text-lg">Tujuan Bayar</h2>
          <p class="text-sm">Kasih tau temen kamu bayarnya kemana</p>
        </div>

        <div class="mb-2" v-if="transferInfo.info.length">
          <h3>
            Bayar ke
            <input
              placeholder="Nama kamu"
              class="bg-transparent text-lg pt-1 underline underline-offset-4 decoration-1 outline-none"
              v-model="transferInfo.name"
            />
          </h3>
        </div>

        <div class="flex flex-col gap-2">
          <div v-for="(info, iInfo) in transferInfo.info" :key="iInfo" class="flex gap-2 mb-2">
            <FormInput
              placeholder="Tujuan (Gopay, Bank)..."
              class="text-sm w-full border-gray-500 placeholder:text-neutral-500"
              v-model="info.name"
            />
            <FormInput
              placeholder="No. HP, Rekening..."
              class="text-sm w-full border-gray-500 placeholder:text-neutral-500"
              v-model="info.number"
            />
            <MinusCircleIcon class="w-10" @click="removeTransferInfo(iInfo)" />
          </div>

          <button class="w-full flex justify-center items-center gap-1 text-sm" @click="addTransferInfo()">
            <PlusIcon class="w-4" />
            <p>Tambah tujuan</p>
          </button>
        </div>
      </div>

      <button class="btn-primary" @click="calculate">Hitung</button>
    </div>
  </div>
</template>

<script setup>
import {
  TrashIcon,
  PlusIcon,
  EllipsisVerticalIcon,
  UserIcon,
  MinusCircleIcon,
  UserPlusIcon,
} from "@heroicons/vue/24/outline";
import draggable from "vuedraggable";
import { v4 as uuidv4 } from "uuid";

const router = useRouter();

const order = useOrder();
const members = useMembers();
const transferInfo = useTransferInfo();

const dragOptions = {
  animation: 200,
  group: "description",
  disabled: false,
  ghostClass: "ghost",
};

onMounted(() => {
  retrieveTransferInfo();
});

const addMember = () => {
  members.value.push({ name: "", menus: [] });
};
const removeMember = (index) => {
  members.value = members.value.filter((_, iMember) => iMember !== index);
};
const addMenu = (iMember) => {
  members.value[iMember].menus.push({ id: uuidv4(), name: "", price: 0 });
};
const removeMenu = (iMember, index) => {
  members.value[iMember].menus = members.value[iMember].menus.filter((_, iMenu) => iMenu !== index);
};
const addTransferInfo = () => {
  transferInfo.value.info.push({ name: "", number: "" });
};
const removeTransferInfo = (index) => {
  transferInfo.value.info = transferInfo.value.info.filter((_, iInfo) => iInfo !== index);
};
const saveMembers = () => {
  const savedMembersCookie = useCookie("saved_members");
  savedMembersCookie.value = JSON.stringify(members.value.map((member) => member.name));
};
const saveTransferInfo = () => {
  const savedTransferInfoCookie = useCookie("saved_transfer_info");
  savedTransferInfoCookie.value = JSON.stringify(transferInfo.value);
};
const retrieveTransferInfo = () => {
  const savedTransferInfoCookie = useCookie("saved_transfer_info");
  transferInfo.value = savedTransferInfoCookie.value;
};
const calculate = () => {
  saveMembers();
  saveTransferInfo();
  router.push("/hitung");
};
</script>
