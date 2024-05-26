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

      <div v-for="(member, iMember) in members" :key="iMember" class="flex flex-col gap-4 bg-[#cedcd3] p-4 rounded-lg">
        <div class="flex justify-between items-center">
          <div class="flex gap-2 items-center">
            <UserIcon class="w-6 text-dark-green" />
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

      <div class="flex flex-col gap-4">
        <div class="flex gap-4 justify-between items-center">
          <label for="delivery">
            <p class="font-bold">Ongkir</p>
            <p class="text-sm leading-4">Biaya pengiriman, Biaya ongkir, delivery</p>
          </label>
          <FormInput
            name="delivery"
            type="number"
            placeholder="Ongkir"
            v-model="order.delivery"
            class="font-bold text-right w-24"
          />
        </div>
        <div class="flex gap-4 justify-between items-center">
          <label for="service">
            <p class="font-bold">Biaya aplikasi</p>
            <p class="text-sm leading-4">Biaya lainnya, service</p>
          </label>
          <FormInput
            name="service"
            type="number"
            placeholder="Biaya aplikasi"
            v-model="order.service"
            class="font-bold text-right w-24"
          />
        </div>
        <div class="flex gap-4 justify-between items-center">
          <label for="discount">
            <p class="font-bold">Diskon</p>
            <p class="text-sm leading-4">Biaya Potongan, Promo</p>
          </label>
          <FormInput
            name="discount"
            type="number"
            placeholder="Diskon"
            v-model="order.discount"
            class="font-bold text-right w-24"
          />
        </div>
      </div>

      <NuxtLink class="btn-primary" to="/hitung">Hitung</NuxtLink>
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

const order = useOrder();
const members = useMembers();

const dragOptions = {
  animation: 200,
  group: "description",
  disabled: false,
  ghostClass: "ghost",
};

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
</script>
