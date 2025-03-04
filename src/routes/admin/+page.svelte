<script lang="ts">
  let newProduct = $state({ title: '', description: '', category: '', image: '', price: 0 });
  let editingIndex = $state<number | null>(null);
  let products = $state<{ title: string; description: string; category: string; image: string; price: number }[]>([] as any);
  let newCategory = $state('');

  $effect(() => {
    const storedProducts = localStorage.getItem('products');
    products = storedProducts ? JSON.parse(storedProducts) : [];
    if (!storedProducts) {
      localStorage.setItem('products', JSON.stringify(products));
    }
  });

  function addProduct(e: Event) {
    e.preventDefault();

    if (newProduct.category === 'new') {
      newProduct.category = newCategory;
    }

    if (editingIndex !== null) {
      products[editingIndex] = { ...newProduct };
      editingIndex = null;
    } else {
      products.push({ ...newProduct });
    }
    newProduct = { title: '', description: '', category: '', image: '', price: 0 };
    newCategory = '';

    resetForm();
    localStorage.setItem('products', JSON.stringify(products));
  }

  function editProduct(index: number) {
    newProduct = { ...products[index] };
    editingIndex = index;
    localStorage.setItem('products', JSON.stringify(products));
  }

  function deleteProduct(index: number) {
    products.splice(index, 1);
    localStorage.setItem('products', JSON.stringify(products));
  }

  function resetForm() {
    newProduct = { title: '', description: '', category: '', image: '', price: 0 };
    newCategory = '';
    editingIndex = null;
  }

  function handleImageUpload(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        newProduct.image = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  let categories = $derived.by(() => {
    return [...new Set(products.map(product => product.category))];
  });
</script>

<div class="container w-full max-w-xl mx-auto p-4">
  <h1 class="text-2xl font-bold mb-4">Product Manager</h1>
  <form onsubmit={addProduct} class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
    <label class="block text-gray-700 text-sm font-bold mb-2" for="title">
      Title
    </label>
    <input type="text" bind:value={newProduct.title} placeholder="Title" class="shadow appearance-none border rounded w-full py-2 px-3 mb-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
    <label class="block text-gray-700 text-sm font-bold mb-2" for="description">
      Description
    </label>
    <input type="text" bind:value={newProduct.description} placeholder="Description" class="shadow appearance-none border rounded w-full py-2 px-3 mb-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
    <label class="block text-gray-700 text-sm font-bold mb-2" for="category">
      Category
    </label>
    <select bind:value={newProduct.category} class="shadow appearance-none border rounded w-full py-2 px-3 mb-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required>
      <option value="" disabled>Select a category</option>
			<option value="new">New Category</option>
      {#each categories as category}
        <option value={category}>{category}</option>
      {:else}
      {/each}
    </select>
    {#if newProduct.category === 'new'}
      <label class="block text-gray-700 text-sm font-bold mb-2" for="newCategory">
        New Category Name
      </label>
      <input type="text" bind:value={newCategory} placeholder="New Category Name" class="shadow appearance-none border rounded w-full py-2 px-3 mb-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
    {/if}
    <label class="block text-gray-700 text-sm font-bold mb-2" for="image">
      Image
    </label>
    <input type="file" accept="image/*" onchange={handleImageUpload} class="shadow appearance-none border rounded w-full py-2 px-3 mb-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
    <label class="block text-gray-700 text-sm font-bold mb-2" for="price">
      Price
    </label>
    <input type="number" step="0.01" bind:value={newProduct.price} placeholder="Price" class="shadow appearance-none border rounded w-full py-2 px-3 mb-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
    <button type="submit" class="p-2 bg-blue-500 text-white rounded">{editingIndex !== null ? 'Update' : 'Add'} Product</button>
  </form>

  <div class="product-list">
    {#each products as product, index}
      <div class="product-item bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex items-center">
        <img src={product.image} alt={product.title} class="w-16 h-16 object-cover mr-4" />
        <div class="flex-1">
          <h2 class="text-xl font-bold">{product.title}</h2>
        </div>
        <button onclick={() => editProduct(index)} class="p-2 bg-yellow-500 text-white rounded mr-2">Edit</button>
        <button onclick={() => deleteProduct(index)} class="p-2 bg-red-500 text-white rounded">Delete</button>
      </div>
    {/each}
  </div>
</div>