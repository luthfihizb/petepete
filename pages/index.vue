<template>
  <div class="w-full h-[80vh] flex flex-col gap-4 justify-center items-center">
    <Head>
      <Title>Pisah Bon Online - Petepete</Title>
      <Meta
        name="description"
        content="Pisah Bon Online, mendukung berbagai format bon seperti GoFood, GrabFood, dan masih banyak lagi"
      />
    </Head>

    <h1 class="font-heading text-5xl font-semibold">petepete</h1>
    <p class="text-center">
      ..karna <b>pisah bon</b> adalah <br />
      lambang keadilan dan kesejahteraan
    </p>

    <div class="flex flex-col">
      <div v-if="ocrLoading" class="btn-primary"><Icon name="svg-spinners:3-dots-fade" size="1.5em" /></div>
      <label v-else for="upload-invoice">
        <div class="btn-primary w-80 gap-2"><ArrowUpTrayIcon class="w-4" /> Unggah Bon</div>
        <input
          class="sr-only"
          id="upload-invoice"
          name="upload-invoice"
          type="file"
          accept=".pdf"
          @change="uploadInvoice"
        />
      </label>
      <NuxtLink class="btn-secondary w-80" to="/bagi">Isi Sendiri</NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { ArrowUpTrayIcon } from "@heroicons/vue/24/outline";

let ocrLoading = ref(false);

const uploadInvoice = async (e) => {
  ocrLoading.value = true;

  const file = e.target.files[0];
  await useInvoiceReaderPdf(file);

  ocrLoading.value = false;
};
</script>
