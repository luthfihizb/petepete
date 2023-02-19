<template>
  <div class="w-full md:px-[20vw] flex flex-col gap-20">
    <Header />

    <div class="flex flex-col gap-8">
      <div class="flex gap-4 items-center">
        <label for="restaurant" class="font-bold w-40">Restoran</label>
        <FormInput name="restaurant" placeholder="Restoran" v-model="order.restaurant" class="font-bold" />
      </div>
      <hr class="border-gray-500" />

      <div v-for="(member, iMember) in members" :key="iMember" class="flex flex-col gap-4">
        <div class="flex gap-4 items-center">
          <FormInput placeholder="Nama" v-model="member.name" class="font-bold" />
          <TrashIcon class="w-6 text-dark-green opacity-40" @click="removeMember(iMember)" />
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
              <FormInput placeholder="Menu" v-model="menu.name" class="text-sm" />
              <FormInput placeholder="Harga" v-model="menu.price" type="number" class="w-20 text-sm text-right" />
              <TrashIcon class="w-8 text-dark-green opacity-40" @click="removeMenu(iMember, iMenu)" />
            </div>
          </template>
        </draggable>
        <button
          class="w-[91%] self-end form-btn w-full flex justify-center items-center gap-1 text-sm mb-4"
          @click="addMenu(iMember)"
        >
          <PlusIcon class="w-4" /> Tambah menu
        </button>
      </div>
      <button class="form-btn w-full flex justify-center items-center gap-1" @click="addMember">
        <PlusIcon class="w-4" /> Tambah member
      </button>

      <hr class="border-gray-500" />
      <div class="flex flex-col gap-4">
        <div class="flex gap-4 items-center">
          <label for="delivery" class="font-bold w-40">Ongkir</label>
          <FormInput
            name="delivery"
            type="number"
            placeholder="Ongkir"
            v-model="order.delivery"
            class="font-bold text-right"
          />
        </div>
        <div class="flex gap-4 items-center">
          <label for="service" class="font-bold w-40">Biaya aplikasi (service)</label>
          <FormInput
            name="service"
            type="number"
            placeholder="Biaya aplikasi"
            v-model="order.service"
            class="font-bold text-right"
          />
        </div>
        <div class="flex gap-4 items-center">
          <label for="discount" class="font-bold w-40">Diskon</label>
          <FormInput
            name="discount"
            type="number"
            placeholder="Diskon"
            v-model="order.discount"
            class="font-bold text-right"
          />
        </div>
      </div>

      <NuxtLink class="btn-primary" to="/hitung">Hitung</NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { TrashIcon, PlusIcon, EllipsisVerticalIcon } from "@heroicons/vue/24/outline";
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
