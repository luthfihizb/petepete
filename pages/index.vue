<template>
  <div class="w-full h-[88vh] flex flex-col gap-4 justify-between items-center">
    <Head>
      <Title>Pisah Bon Online - Petepete</Title>
      <Meta
        name="description"
        content="Pisah Bon Online, mendukung berbagai format bon seperti GoFood, GrabFood, dan masih banyak lagi"
      />
    </Head>

    <Header />

    <div class="p-4 mt-6">
      <img src="../assets/img/hero-01.png" />
    </div>

    <h2 class="text-left text-4xl w-full">
      Sekarang, <br />
      <b>Pisah Bon</b> jadi<br />
      makin gampang
    </h2>

    <div class="flex flex-col w-full">
      <p class="whitespace-nowrap text-sm">Mendukung format bon:</p>
      <div>
        <img
          class="object-contain h-4"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Gofood_logo.svg/2560px-Gofood_logo.svg.png"
        />
      </div>
    </div>

    <div class="flex flex-col w-full gap-2">
      <div v-if="ocrLoading" class="btn-primary"><Icon name="svg-spinners:3-dots-fade" size="1.5em" /></div>
      <label v-else for="upload-invoice">
        <div class="btn-primary gap-2"><ArrowUpTrayIcon class="w-4" /> Unggah Bon</div>
        <input
          class="sr-only"
          id="upload-invoice"
          name="upload-invoice"
          type="file"
          accept=".pdf"
          @change="uploadInvoice"
        />
      </label>
      <NuxtLink class="text-center font-semibold" to="/bagi">Isi Sendiri</NuxtLink>
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
