<script lang="ts">
  import { addItemToCart, getCartItems } from "$lib/stores/Cart.svelte";
  let products = $state<{ title: string; description: string; category: string; image: string; price: number }[]>([] as any);
  let categories = $derived.by(() => [...new Set(products.map(product => product.category))]);
  let selectedCategories = $state(new Set(categories));

  let touchStartX = $state(null);
  let touchStartY = $state(null);
  let touchTimeout = $state(null);
  const touchThreshold = $state(10);

  function touchStart(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    
    // Create a timeout to consider it a tap if no movement occurs
    touchTimeout = setTimeout(() => {
      touchStartX = null;
      touchStartY = null;
    }, 200);
  };

  function touchMove(e) {
    if (!touchStartX || !touchStartY) return;
    
    const touchX = e.touches[0].clientX;
    const touchY = e.touches[0].clientY;
    
    // Calculate distance moved
    const diffX = Math.abs(touchX - touchStartX);
    const diffY = Math.abs(touchY - touchStartY);
    
    // If movement is greater than threshold, it's a scroll - cancel the tap
    if (diffX > touchThreshold || diffY > touchThreshold) {
      clearTimeout(touchTimeout);
      touchStartX = null;
      touchStartY = null;
    }
  };

  function touchEnd(e) {
    if (touchStartX !== null && touchStartY !== null) {
      clearTimeout(touchTimeout);
      
      const product = JSON.parse(e.target.closest('[data-item]').dataset.item);
      addItemToCart(product);
    }
    
    // Reset touch tracking
    touchStartX = null;
    touchStartY = null;
  };

  $effect(() => {
    const storedProducts = localStorage.getItem('products');
    products = storedProducts ? JSON.parse(storedProducts) : [];
    selectedCategories = new Set(categories);
    if (!storedProducts) {
      localStorage.setItem('products', JSON.stringify(products));
    }
  });

  function getQuantity(product) {
    const item = getCartItems().find(item => item.title === product.title);
    return item ? item.quantity : 0;
  }

  function toggleCategory(category) {
    if (selectedCategories.has(category)) {
      selectedCategories.delete(category);
    } else {
      selectedCategories.add(category);
    }
    selectedCategories = new Set(selectedCategories); // Trigger reactivity
  }
</script>

{#if products.length}
  <div class="w-full mx-auto p-4">
    <h2 class="text-xl font-bold">Categories</h2>
    <div class="flex flex-wrap gap-2 mb-4">
      {#each categories as category}
        <button
          class={`px-4 py-2 rounded ${selectedCategories.has(category) ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}`}
          onclick={() => toggleCategory(category)} >
          {category}
        </button>
      {/each}
    </div>
    <h2 class="text-xl font-bold">Products</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      {#each products.filter(product => selectedCategories.has(product.category)) as product, index}
        <div class="relative p-4 border rounded shadow-lg" data-item={JSON.stringify(product)} ontouchstart={touchStart} ontouchmove={touchMove} ontouchend={touchEnd} role="button">
          <h2 class="text-xl font-bold">{product.title}</h2>
          <img src={product.image} alt={product.title} class="w-full aspect-5/4 object-cover mt-2" />
          <div class="mt-2 flex justify-between items-end">
            <div>
              <!-- <p>{product.description}</p> -->
              <p class="text-gray-500">{product.category}</p>
              <p class="text-gray-500">${product.price.toFixed(2)}</p>
            </div>
            {#if getQuantity(product) > 0}
              <div class="bg-primary/75 rounded-full w-6 h-6 flex items-center justify-center">
                {getQuantity(product)}
              </div>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  </div>
{:else}
  <div class="container w-full max-w-xl mx-auto p-4">
    <p class="text-center">No products found</p>
  </div>
{/if}