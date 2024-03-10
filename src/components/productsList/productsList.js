import ProductItem from "../productItem/productItem";
import "./productsList.sass"

const ProductsList = ({productsInfo}) => {
    //console.log(productsInfo)
    return (
        <div className="productsBlock">
            {(productsInfo !== null) ?
                (productsInfo
                    .map((product, key) => {
                        return (
                            <ProductItem product={product} key={key}></ProductItem>
                        )
                    })) : (
                    <div className="dowload">
                        <p>Загрузка.....</p>
                    </div>
                )
            }
        </div>
    )
}

export default ProductsList