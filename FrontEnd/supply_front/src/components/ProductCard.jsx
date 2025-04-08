const ProductCard = () => {
  return (
    <div className="p-4 bg-gray-800 rounded-lg shadow-lg">
      <img src="/assets/product.png" alt="Product" className="w-full rounded-md" />
      <h3 className="mt-2 text-lg font-semibold">Electronic Device #123</h3>
      <p className="text-gray-400">Price: 0.1 ETH</p>
      <button className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-700 rounded-md">Buy Now</button>
    </div>
  );
};

export default ProductCard;
