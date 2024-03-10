import React from 'react';
import './productItem.sass';

const ProductItem = ({product, key}) => {
    return (
        <div className="product" key={key}>
            <div className="productInfo">
                <p>{product.product}</p>
            </div>
            {(product.brand) &&
                <div className="productBrand">
                    <p>Бренд: {product.brand}</p>
                </div>
            }
            <div className="productPrice">
                <p>Цена: {product.price}</p>
            </div>

        </div>
    );
};

export default ProductItem;
