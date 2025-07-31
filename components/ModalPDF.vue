<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white rounded-lg shadow-lg w-full max-w-3xl p-6 relative" style="max-height: 95vh; overflow-y: auto;">
      <button @click="$emit('close')" class="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl">&times;</button>
      <div class="overflow-y-auto" style="max-height: 80vh;">
        <div ref="pdfContent" class="bg-white border-2 border-blue-600 p-0 text-xs font-sans" style="min-width: 700px;">
          <!-- Encabezado -->
          <div class="flex items-center border-b-2 border-blue-600">
            <div class="flex-1 text-center text-2xl font-bold text-blue-800 py-2">
              <span v-if="modoLectura">{{ form.empresa }}</span>
              <input v-else v-model="form.empresa" class="w-full text-center font-bold text-blue-800 bg-transparent outline-none" />
            </div>
            <div class="flex-1 text-center text-2xl font-bold text-blue-800 py-2 border-l-2 border-blue-600">
              <span v-if="modoLectura">{{ form.titulo }}</span>
              <input v-else v-model="form.titulo" class="w-full text-center font-bold text-blue-800 bg-transparent outline-none" />
            </div>
            <div class="w-20 text-right text-2xl font-bold text-blue-800 py-2 border-l-2 border-blue-600 pr-2">
              <span v-if="modoLectura">{{ form.numero }}</span>
              <input v-else v-model="form.numero" class="w-full text-right font-bold text-blue-800 bg-transparent outline-none" />
            </div>
          </div>
          <!-- Datos del Proveedor -->
          <div class="p-2 border-b border-blue-600">
            <span class="font-bold text-blue-800">Datos del Proveedor:</span>
            <span v-if="modoLectura">{{ form.proveedor }}</span>
            <input v-else v-model="form.proveedor" class="font-bold bg-transparent outline-none" />
            <br>
            Domicilio Legal: <span v-if="modoLectura">{{ form.domicilioProveedor }}</span>
            <input v-else v-model="form.domicilioProveedor" class="bg-transparent outline-none w-2/3" />
            <br>
            Cuentas Bancarias en <span class="font-bold">CUP:<span v-if="modoLectura">{{ form.cupProveedor }}</span><input v-else v-model="form.cupProveedor" class="bg-transparent outline-none w-32 font-bold" /></span> en <span class="font-bold">USD: <span v-if="modoLectura">{{ form.usdProveedor }}</span><input v-else v-model="form.usdProveedor" class="bg-transparent outline-none w-40 font-bold" /></span>
            <br>
            NIT: <span v-if="modoLectura">{{ form.nitProveedor }}</span><input v-else v-model="form.nitProveedor" class="bg-transparent outline-none w-40" />
          </div>
          <!-- Datos del Cliente -->
          <div class="p-2 border-b border-blue-600">
            <span class="font-bold text-blue-800">Datos del Cliente:</span><br>
            Domicilio Legal: <span v-if="modoLectura">{{ form.domicilioCliente }}</span>
            <input v-else v-model="form.domicilioCliente" class="bg-transparent outline-none w-2/3" />
            <br>
            Cuentas Bancarias en CUP: <span v-if="modoLectura">{{ form.cupCliente }}</span><input v-else v-model="form.cupCliente" class="bg-transparent outline-none w-32" /> Sucursal: <span v-if="modoLectura">{{ form.sucursalCliente }}</span><input v-else v-model="form.sucursalCliente" class="bg-transparent outline-none w-32" />
            <br>
            Código REEUP: <span v-if="modoLectura">{{ form.reeupCliente }}</span><input v-else v-model="form.reeupCliente" class="bg-transparent outline-none w-32" /> NIT: <span v-if="modoLectura">{{ form.nitCliente }}</span><input v-else v-model="form.nitCliente" class="bg-transparent outline-none w-32" />
          </div>
          <!-- Tabla de productos/servicios -->
          <table class="w-full border-collapse border-blue-600" style="font-size: 12px;">
            <thead>
              <tr class="bg-blue-100 text-blue-800">
                <th class="border border-blue-600 px-1">No</th>
                <th class="border border-blue-600 px-1">Descripción</th>
                <th class="border border-blue-600 px-1">U/M</th>
                <th class="border border-blue-600 px-1">Cantidad</th>
                <th class="border border-blue-600 px-1">Precio</th>
                <th class="border border-blue-600 px-1">Importe</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, i) in form.tabla" :key="i">
                <td class="border border-blue-600 px-1 py-3">
                  <span v-if="modoLectura">{{ row.no }}</span>
                  <input v-else v-model="row.no" class="w-full bg-transparent outline-none text-center" />
                </td>
                <td class="border border-blue-600 px-1 py-3">
                  <span v-if="modoLectura">{{ row.descripcion }}</span>
                  <input v-else v-model="row.descripcion" class="w-full bg-transparent outline-none" />
                </td>
                <td class="border border-blue-600 px-1 py-3">
                  <span v-if="modoLectura">{{ row.um }}</span>
                  <input v-else v-model="row.um" class="w-full bg-transparent outline-none text-center" />
                </td>
                <td class="border border-blue-600 px-1 py-3">
                  <span v-if="modoLectura">{{ row.cantidad }}</span>
                  <input v-else v-model="row.cantidad" class="w-full bg-transparent outline-none text-center" />
                </td>
                <td class="border border-blue-600 px-1 py-3">
                  <span v-if="modoLectura">{{ row.precio }}</span>
                  <input v-else v-model="row.precio" class="w-full bg-transparent outline-none text-center" />
                </td>
                <td class="border border-blue-600 px-1 py-3">
                  <span v-if="modoLectura">{{ row.importe }}</span>
                  <input v-else v-model="row.importe" class="w-full bg-transparent outline-none text-center" />
                </td>
              </tr>
              <tr>
                <td class="border border-blue-600 px-1 text-right font-bold" colspan="4">Totales</td>
                <td class="border border-blue-600 px-1 text-right font-bold">
                  <span v-if="modoLectura">{{ form.totalPrecio }}</span>
                  <input v-else v-model="form.totalPrecio" class="w-full bg-transparent outline-none text-right font-bold" />
                </td>
                <td class="border border-blue-600 px-1 text-right font-bold">
                  <span v-if="modoLectura">{{ form.totalImporte }}</span>
                  <input v-else v-model="form.totalImporte" class="w-full bg-transparent outline-none text-right font-bold" />
                </td>
              </tr>
            </tbody>
          </table>
          <!-- Representantes -->
          <div class="flex border-t border-blue-600 mt-0">
            <div class="w-1/2 p-2 border-r border-blue-600">
              <div class="font-bold text-blue-800">REPRESENTANTE DEL PROVEEDOR</div>
              Nombre: <span v-if="modoLectura">{{ form.nombreProveedor }}</span>
              <input v-else v-model="form.nombreProveedor" class="bg-transparent outline-none w-40" /><br>
              CI: <span v-if="modoLectura">{{ form.ciProveedor }}</span>
              <input v-else v-model="form.ciProveedor" class="bg-transparent outline-none w-32" /><br>
              Cargo: <span v-if="modoLectura">{{ form.cargoProveedor }}</span>
              <input v-else v-model="form.cargoProveedor" class="bg-transparent outline-none w-32" /><br>
              Fecha de Entrega: <span v-if="modoLectura">{{ form.fechaEntregaProveedor }}</span>
              <input v-else v-model="form.fechaEntregaProveedor" class="bg-transparent outline-none w-32" /><br>
              Firma: <span v-if="modoLectura">{{ form.firmaProveedor }}</span>
              <input v-else v-model="form.firmaProveedor" class="bg-transparent outline-none w-32" /><br>
              Cuño: <span v-if="modoLectura">{{ form.cunoProveedor }}</span>
              <input v-else v-model="form.cunoProveedor" class="bg-transparent outline-none w-32" />
            </div>
            <div class="w-1/2 p-2">
              <div class="font-bold text-blue-800">REPRESENTANTE DEL CLIENTE</div>
              Nombre: <span v-if="modoLectura">{{ form.nombreCliente }}</span>
              <input v-else v-model="form.nombreCliente" class="bg-transparent outline-none w-40" /><br>
              CI: <span v-if="modoLectura">{{ form.ciCliente }}</span>
              <input v-else v-model="form.ciCliente" class="bg-transparent outline-none w-32" /><br>
              Cargo: <span v-if="modoLectura">{{ form.cargoCliente }}</span>
              <input v-else v-model="form.cargoCliente" class="bg-transparent outline-none w-32" /><br>
              Fecha de Entrega: <span v-if="modoLectura">{{ form.fechaEntregaCliente }}</span>
              <input v-else v-model="form.fechaEntregaCliente" class="bg-transparent outline-none w-32" /><br>
              Firma: <span v-if="modoLectura">{{ form.firmaCliente }}</span>
              <input v-else v-model="form.firmaCliente" class="bg-transparent outline-none w-32" />
            </div>
          </div>
          <!-- Observaciones y pie -->
          <div class="p-2 border-t border-blue-600">
            <span class="font-bold text-blue-800">Observaciones:</span><br>
            <span v-if="modoLectura">{{ form.observaciones }}</span>
            <textarea v-else v-model="form.observaciones" class="w-full bg-transparent outline-none resize-none" rows="2"></textarea><br>
            <span class="font-bold">Paguese a: <span v-if="modoLectura">{{ form.pagoA }}</span><input v-else v-model="form.pagoA" class="bg-transparent outline-none w-96 font-bold" /></span><br>
            <span class="text-red-600 font-bold">{{ form.validez }}</span>
          </div>
        </div>
      </div>
      <div class="flex justify-end mt-4">
        <button @click="exportarPDF" class="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Exportar a PDF
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, nextTick } from 'vue';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const props = defineProps({
  show: Boolean,
  ofertaData: {
    type: Object,
    default: () => ({})
  }
});
const emit = defineEmits(['close']);

const pdfContent = ref(null);
const modoLectura = ref(false);

const form = reactive({
  empresa: 'SOLUTEL S.R.L',
  titulo: 'OFERTA COMERCIAL',
  numero: '/25',
  proveedor: 'SOLUTEL S.R.L',
  domicilioProveedor: 'Calle Ernesto Valdez Muñoz No. 10 entre Independencia y Céspedes,',
  cupProveedor: '1252354000140315',
  usdProveedor: '1299750000010836',
  nitProveedor: '50004182197',
  domicilioCliente: '',
  cupCliente: '',
  sucursalCliente: '',
  reeupCliente: '',
  nitCliente: '',
  tabla: Array.from({ length: 9 }, (_, i) => ({
    no: i === 0 ? 'No.1' : '',
    descripcion: '',
    um: '',
    cantidad: '',
    precio: '',
    importe: ''
  })),
  totalPrecio: '0.00',
  totalImporte: '0.00',
  nombreProveedor: 'Belkis Martínez Arevalo',
  ciProveedor: '70081403279',
  cargoProveedor: 'Especialista',
  fechaEntregaProveedor: '',
  firmaProveedor: '',
  cunoProveedor: '',
  nombreCliente: '',
  ciCliente: '',
  cargoCliente: '',
  fechaEntregaCliente: '',
  firmaCliente: '',
  observaciones: '',
  pagoA: 'SOLUTEL S.R.L Cuenta Bancaria: CUP:1252354000140315',
  validez: 'La Oferta válida por 7 días'
});

const valoresBase = {
  empresa: 'SOLUTEL S.R.L',
  titulo: 'OFERTA COMERCIAL',
  numero: '/25',
  proveedor: 'SOLUTEL S.R.L',
  domicilioProveedor: 'Calle Ernesto Valdez Muñoz No. 10 entre Independencia y Céspedes,',
  cupProveedor: '1252354000140315',
  usdProveedor: '1299750000010836',
  nitProveedor: '50004182197',
  domicilioCliente: '',
  cupCliente: '',
  sucursalCliente: '',
  reeupCliente: '',
  nitCliente: '',
  tabla: Array.from({ length: 9 }, (_, i) => ({
    no: i === 0 ? 'No.1' : '',
    descripcion: '',
    um: '',
    cantidad: '',
    precio: '',
    importe: ''
  })),
  totalPrecio: '0.00',
  totalImporte: '0.00',
  nombreProveedor: 'Belkis Martínez Arevalo',
  ciProveedor: '70081403279',
  cargoProveedor: 'Especialista',
  fechaEntregaProveedor: '',
  firmaProveedor: '',
  cunoProveedor: '',
  nombreCliente: '',
  ciCliente: '',
  cargoCliente: '',
  fechaEntregaCliente: '',
  firmaCliente: '',
  observaciones: '',
  pagoA: 'SOLUTEL S.R.L Cuenta Bancaria: CUP:1252354000140315',
  validez: 'La Oferta válida por 7 días'
};

function resetForm() {
  Object.assign(form, JSON.parse(JSON.stringify(valoresBase)));
}

watch(
  () => props.show,
  (nuevo) => {
    if (nuevo) {
      resetForm();
    }
    if (nuevo && props.ofertaData) {
      if (props.ofertaData.contrato && props.ofertaData.contrato.entidad) {
        const entidad = props.ofertaData.contrato.entidad;
        form.domicilioCliente = entidad.direccion || '';
        form.cupCliente = entidad.cuenta_bancaria || '';
        form.sucursalCliente = '';
        form.reeupCliente = entidad.codigo_reo || '';
        form.nitCliente = entidad.codigo_nit || '';
      }
      if (props.ofertaData.descripcion) {
        form.tabla[0].descripcion = props.ofertaData.descripcion;
      }
    }
    if (!nuevo) {
      resetForm();
    }
  }
);

async function exportarPDF() {
  try {
    modoLectura.value = true;
    await nextTick();
    const element = pdfContent.value;
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true
    });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pageWidth - 10;
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    if (pdfHeight <= pageHeight - 10) {
      pdf.addImage(imgData, 'PNG', 5, 5, pdfWidth, pdfHeight);
    } else {
      let heightLeft = pdfHeight;
      let position = 5;
      pdf.addImage(imgData, 'PNG', 5, position, pdfWidth, pdfHeight);
      heightLeft -= (pageHeight - 10);
      while (heightLeft >= 0) {
        position = heightLeft - pdfHeight + 5;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 5, position, pdfWidth, pdfHeight);
        heightLeft -= (pageHeight - 10);
      }
    }
    pdf.save('Oferta.pdf');
  } catch (error) {
    alert('Error al generar el PDF.');
  } finally {
    modoLectura.value = false;
    await nextTick();
  }
}
</script>

<style scoped>
.font-sans {
  font-family: Arial, Helvetica, sans-serif;
}
input, textarea {
  border: none;
  border-bottom: 1px dotted #60a5fa;
  outline: none;
  background: transparent;
  font-size: inherit;
  color: inherit;
}
input:focus, textarea:focus {
  border-bottom: 1px solid #2563eb;
  background: #e0f2fe;
}
</style> 