async function fetchProductDemo() {
  const response = await fetch('https://dummyjson.com/products/1');
  const productData = await response.json();
  console.log('💾 Product Data:', productData);
}

fetchProductDemo();
