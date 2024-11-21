<template>
    <div class="header-container row align-items-center mx-4">
      <div class="col-md-5">
        <h4 class="page-title">{{ pageTitle }}</h4>
      </div>
      <div class="col-md-7">
        <div class="page-title-box">
          <div class="page-title-right">
            <ol class="breadcrumb m-0 justify-content-end">
              <li
                v-for="(item, index) in breadcrumbs"
                :key="index"
                :class="index !== breadcrumbs.length - 1 ? 'breadcrumb-item' : 'breadcrumb-item active'"
              >
                <!-- If the item is the last one, no link -->
                <a v-if="index !== breadcrumbs.length - 1" :href="item.url" class="breadcrumb-link">
                  {{ item.label }}
                </a>
                <span v-else>{{ item.label }}</span>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    pageTitle: {
      type: String,
      required: true,
    },
    breadcrumbs: {
      type: Array,
      required: true,
      validator(value) {
        return value.every(item => 'label' in item && 'url' in item);
      },
    },
  });
  </script>
  
  <style scoped>
  /* Container Styling */
  .header-container {
    padding: 20px 0;
    background-color: #f8f9fa; /* Subtle background for header */
    border-bottom: 1px solid #dee2e6; /* Subtle divider */
  }
  
  /* Page Title */
  .page-title {
    font-size: 1.75rem;
    font-weight: bold;
    color: #343a40;
  }
  
  /* Breadcrumbs */
  .breadcrumb {
    background-color: transparent;
    padding: 0;
    margin-bottom: 0;
    font-size: 0.875rem;
  }
  
  .breadcrumb-item {
    color: #6c757d;
  }
  
  .breadcrumb-item.active {
    color: #343a40;
    font-weight: bold;
  }
  
  .breadcrumb-link {
    text-decoration: none;
    color: #007bff;
    transition: color 0.3s;
  }
  
  .breadcrumb-link:hover {
    color: #0056b3;
  }
  
  /* Responsiveness */
  @media (max-width: 768px) {
    .header-container {
      text-align: center;
    }
  
    .breadcrumb {
      justify-content: center;
    }
  }
  </style>
  