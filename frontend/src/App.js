import data from './data';
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <a href="/">FormulaRush</a>
      </header>
      <main>
        <h1>Featured Products</h1>
        <div className="products">
          {data.products.map((product) => (
            <div>
              <div className="product" key={product.slug}>
                <img src={product.image} alt={product.name} />
                <p>{product.name}</p>
                <p>{product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
