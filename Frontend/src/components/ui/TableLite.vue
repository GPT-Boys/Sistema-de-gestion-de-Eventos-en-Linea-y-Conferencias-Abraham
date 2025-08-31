<template>
  <div class="card">
    <div v-if="loading" class="skeleton">Cargando…</div>

    <div v-else class="table-wrap">
      <table class="table">
        <thead>
          <tr>
            <th v-for="c in columns" :key="c.key">{{ c.label }}</th>
            <th v-if="$slots.actions" class="th-actions">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in rows" :key="r[rowKey]">
            <td v-for="c in columns" :key="c.key">
              <slot :name="`cell-${c.key}`" :row="r" :value="r[c.key]">
                {{ r[c.key] }}
              </slot>
            </td>
            <td v-if="$slots.actions" class="td-actions">
              <slot name="actions" :row="r"></slot>
            </td>
          </tr>
          <tr v-if="!rows || rows.length === 0">
            <td :colspan="columns.length + ($slots.actions ? 1 : 0)" class="empty">Sin datos</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
defineProps({
  columns: { type: Array, required: true }, // [{ key, label }]
  rows:    { type: Array, required: true },
  loading: { type: Boolean, default: false },
  rowKey:  { type: String,  default: 'id' },
})
</script>

<style scoped>
.card{
  background:#fff; border:1px solid #eef0f4; border-radius:16px; padding:12px;
  box-shadow: 0 10px 30px rgba(17,24,39,.06);
}
.skeleton{ padding: 18px; color:#6b7280; }
.table-wrap{ overflow:auto; }
.table{ width:100%; border-collapse: collapse; }
th, td{ padding:10px 12px; border-bottom:1px solid #f1f5f9; text-align:left; }
thead th{ font-size:12px; text-transform:uppercase; letter-spacing:.05em; color:#64748b; }
tbody tr:hover{ background:#fafbff; }
.empty{ text-align:center; color:#64748b; padding:16px; }
.th-actions, .td-actions{ width:1%; white-space:nowrap; text-align:right; }
</style>
